// ==UserScript==
// @name        A.C.A.S (Advanced Chess Assistance System)
// @namespace   HKR
// @author      HKR
// @version     1.0
// @match       https://www.chess.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @description Enhance your chess performance with a cutting-edge real-time move analysis and strategy assistance system
// @require     https://github.com/AugmentedWeb/UserGui/raw/Release-1.0/usergui.js
// @resource    jquery.js       https://raw.githubusercontent.com/Hakorr/Userscripts/main/Other/A.C.A.S/content/jquery.js
// @resource    chessboard.js   https://raw.githubusercontent.com/Hakorr/Userscripts/main/Other/A.C.A.S/content/chessboard.js
// @resource    chessboard.css  https://raw.githubusercontent.com/Hakorr/Userscripts/main/Other/A.C.A.S/content/chessboard.css
// @resource    lozza.js        https://raw.githubusercontent.com/Hakorr/Userscripts/main/Other/A.C.A.S/content/lozza.js
// @run-at      document-start
// @inject-into content
// ==/UserScript==

/*
     e            e88~-_            e           ,d88~~\
    d8b          d888   \          d8b          8888
   /Y88b         8888             /Y88b         `Y88b
  /  Y88b        8888            /  Y88b         `Y88b,
 /____Y88b  d88b Y888   / d88b  /____Y88b  d88b    8888
/      Y88b Y88P  "88_-~  Y88P /      Y88b Y88P \__88P'

Advanced Chess Assistance System (A.C.A.S) v1 | Q1 2023

[WARNING]
- Please be advised that the use of A.C.A.S may violate the rules and lead to disqualification or banning from tournaments and online platforms.
- The developers of A.C.A.S and related systems will NOT be held accountable for any consequences resulting from its use.
- We strongly advise to use A.C.A.S only in a controlled environment ethically.*/

// DANGER ZONE - DO NOT PROCEED IF YOU DON'T KNOW WHAT YOU'RE DOING //
/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
//////////////////////////////////////////////////////////////////////
// DANGER ZONE - DO NOT PROCEED IF YOU DON'T KNOW WHAT YOU'RE DOING //

const repositoryRawURL = 'https://raw.githubusercontent.com/Hakorr/Userscripts/main/Other/A.C.A.S';
const repositoryURL = 'https://github.com/Hakorr/Userscripts/tree/main/Other/A.C.A.S';

let lozzaObjectURL = null;

const dbValues = {
    engineDepthQuery: 'engineDepthQuery'
};

let chessBoardElem = null;
let lastBasicFen = null;

let firstMoveMade = false;
let initialized = false;

let engine = null;
let uiChessBoard = null;

let Interface = null;

let activeBestMoveMarkings = [];

let engineLogNum = 1;
let userscriptLogNum = 1;

let turn = '-';
let playerColor = null;

let activeEngine = 'Lozza';

function eloToTitle(elo) {
    return elo >= 2900 ? "Cheater"
    : elo >= 2500 ? "Grandmaster"
    : elo >= 2400 ? "International Master"
    : elo >= 2300 ? "Fide Master"
    : elo >= 2200 ? "National Master"
    : elo >= 2000 ? "Expert"
    : elo >= 1800 ? "Tournament Player"
    : elo >= 1700 ? "Experienced"
    : elo >= 1600 ? "Experienced"
    : elo >= 1400 ? "Intermediate"
    : elo >= 1200 ? "Average"
    : elo >= 1000 ? "Casual"
    : "Beginner";
}

const engineEloArr = [
    { elo: 1200, data: 'go depth 1' },
    { elo: 1300, data: 'go depth 2' },
    { elo: 1450, data: 'go depth 3' },
    { elo: 1750, data: 'go depth 4' },
    { elo: 2000, data: 'go depth 5' },
    { elo: 2200, data: 'go depth 6' },
    { elo: 2300, data: 'go depth 7' },
    { elo: 2400, data: 'go depth 8' },
    { elo: 2500, data: 'go depth 9' },
    { elo: 2600, data: 'go depth 10' },
    { elo: 2900, data: 'go movetime 3000' },
    { elo: 3000, data: 'go movetime 10000' }
];

function getCurrentEngineElo() {
    return engineEloArr.find(x => x.data == GM_getValue(dbValues.engineDepthQuery))?.elo;
}

const getEloDescription = elo => `Approx. ${elo} (${eloToTitle(elo)})`;

const Gui = new UserGui;
Gui.settings.window.title = 'A.C.A.S';
Gui.settings.window.external = true;
Gui.settings.window.size.width = 500;
Gui.settings.gui.external.popup = false;
Gui.settings.gui.external.style += GM_getResourceText('chessboard.css');
Gui.settings.gui.external.style += `
div[class^='board'] {
    background-color: black;
}
.best-move-from {
    background-color: #31ff7f;
    transform: scale(0.85);
}
.best-move-to {
    background-color: #31ff7f;
}
.negative-best-move-from {
    background-color: #fd0000;
    transform: scale(0.85);
}
.negative-best-move-to {
    background-color: #fd0000;
}
body {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 360px;
}
#fen {
    margin-left: 10px;
}
#engine-log-container {
    max-height: 35vh;
    overflow: auto!important;
}
#userscript-log-container {
    max-height: 35vh;
    overflow: auto!important;
}
.sideways-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.rendered-form .card {
    margin-bottom: 10px;
}
.hidden {
    display: none;
}
.main-title-bar {
    display: flex;
    justify-content: space-between;
}
@keyframes wiggle {
    0% { transform: scale(1); }
   80% { transform: scale(1); }
   85% { transform: scale(1.1); }
   95% { transform: scale(1); }
  100% { transform: scale(1); }
}

.wiggle {
  display: inline-block;
  animation: wiggle 1s infinite;
}
`;

function FenUtils() {
    this.board = [
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
        ];

    this.pieceCodeToFen = pieceStr => {
        const [pieceColor, pieceName] = pieceStr.split('');

        return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
    }

    this.getFenCodeFromPieceElem = pieceElem => {
        return this.pieceCodeToFen([...pieceElem.classList].find(x => x.match(/^(b|w)[prnbqk]{1}$/)));
    }

    this.getPieceColor = pieceFenStr => {
        return pieceFenStr == pieceFenStr.toUpperCase() ? 'w' : 'b';
    }

    this.getPieceOppositeColor = pieceFenStr => {
        return this.getPieceColor(pieceFenStr) == 'w' ? 'b' : 'w';
    }

    this.squeezeEmptySquares = fenStr => {
        return fenStr.replace(/11111111/g, '8')
            .replace(/1111111/g, '7')
            .replace(/111111/g, '6')
            .replace(/11111/g, '5')
            .replace(/1111/g, '4')
            .replace(/111/g, '3')
            .replace(/11/g, '2');
    }

    this.posToIndex = pos => {
        const [x, y] = pos.split('');

        return { 'y': 8 - y, 'x': 'abcdefgh'.indexOf(x) };
    }

    this.getBoardPiece = pos => {
        const indexObj = this.posToIndex(pos);

        return this.board[indexObj.y][indexObj.x];
    }

    this.getRights = () => {
        let rights = '';

        // check for white
        const e1 = this.getBoardPiece('e1'),
              h1 = this.getBoardPiece('h1'),
              a1 = this.getBoardPiece('a1');

        if(e1 == 'K' && h1 == 'R') rights += 'K';
        if(e1 == 'K' && a1 == 'R') rights += 'Q';

        //check for black
        const e8 = this.getBoardPiece('e8'),
              h8 = this.getBoardPiece('h8'),
              a8 = this.getBoardPiece('a8');

        if(e8 == 'k' && h8 == 'r') rights += 'k';
        if(e8 == 'k' && a8 == 'r') rights += 'q';

        return rights ? rights : '-';
    }

    this.getBasicFen = () => {
        const pieceElems = [...chessBoardElem.querySelectorAll('.piece')];

        pieceElems.forEach(pieceElem => {
            const pieceFenCode = this.getFenCodeFromPieceElem(pieceElem);
            const [xPos, yPos] = pieceElem.classList.toString().match(/square-(\d)(\d)/).slice(1);

            this.board[8 - yPos][xPos - 1] = pieceFenCode;
        });

        const basicFen = this.squeezeEmptySquares(this.board.map(x => x.join('')).join('/'));

        return basicFen;
    }

    this.getFen = () => {
        const basicFen = this.getBasicFen();
        const rights = this.getRights();

        return `${basicFen} ${turn} ${rights} - 0 1`;
    }
}

function InterfaceUtils() {
    this.board = {
        findSquareElem: (squareCode) => {
            return Gui.document.querySelector(`.square-${squareCode}`);
        },
        markBestMove: (fromSquare, toSquare, isPlayerTurn) => {
            const [fromElem, toElem] = [this.board.findSquareElem(fromSquare), this.board.findSquareElem(toSquare)];

            if(isPlayerTurn) {
                fromElem.classList.add('best-move-from');
                toElem.classList.add('best-move-to');
            } else {
                fromElem.classList.add('negative-best-move-from');
                toElem.classList.add('negative-best-move-to');
            }

            activeBestMoveMarkings.push(fromElem);
            activeBestMoveMarkings.push(toElem);
        },
        removeBestMarkings: () => {
            activeBestMoveMarkings.forEach(elem => {
                elem.classList.remove('best-move-from', 'best-move-to', 'negative-best-move-from', 'negative-best-move-to');
            });

            activeBestMoveMarkings = [];
        },
        updateBoardFen: fen => {
             Gui.document.querySelector('#fen').textContent = fen;
        },
        updateBoardOrientation: orientation => {
            const orientationElem = Gui?.document?.querySelector('#orientation');

            if(orientationElem) {
                orientationElem.textContent = orientation;
            }
        }
    }

    this.engineLog = str => {
        const logElem = document.createElement('div');
        logElem.classList.add('list-group-item');

        if(str.includes('info')) logElem.classList.add('list-group-item-info');
        if(str.includes('bestmove')) logElem.classList.add('list-group-item-success');

        logElem.innerText = `#${engineLogNum++} ${str}`;

        Gui.document.querySelector('#engine-log-container').prepend(logElem);
    }

    this.log = str => {
        const logElem = document.createElement('div');
        logElem.classList.add('list-group-item');

        if(str.includes('info')) logElem.classList.add('list-group-item-info');
        if(str.includes('bestmove')) logElem.classList.add('list-group-item-success');

        const container = Gui?.document?.querySelector('#userscript-log-container');

        if(container) {
            logElem.innerText = `#${userscriptLogNum++} ${str}`;

            container.prepend(logElem);
        }
    }

    this.getBoardOrientation = () => {
        return document.querySelector('.board.flipped') ? 'b' : 'w';
    }

    this.updateBestMoveProgress = text => {
        const progressBarElem = Gui.document.querySelector('#best-move-progress');

        progressBarElem.innerText = text;

        progressBarElem.classList.remove('hidden');
        progressBarElem.classList.add('wiggle');
    }

    this.stopBestMoveProcessingAnimation = () => {
        const progressBarElem = Gui.document.querySelector('#best-move-progress');

        progressBarElem.classList.remove('wiggle');
    }

    this.hideBestMoveProgress = () => {
        const progressBarElem = Gui.document.querySelector('#best-move-progress');

        if(!progressBarElem.classList.contains('hidden')) {
            progressBarElem.classList.add('hidden');
            this.stopBestMoveProcessingAnimation();
        }
    }
}

function separateMoveCodes(moveCode) {
    moveCode = moveCode.trim();

    let move = moveCode.split(' ').pop();

    return [move.slice(0,2), move.slice(2,4)];
}

function extractInfo(str) {
    const keys = ['time', 'nps', 'depth'];

    return keys.reduce((acc, key) => {
      const match = str.match(`${key} (\\d+)`);
      if (match) {
        acc[key] = Number(match[1]);
      }
      return acc;
    }, {});
}

function updateBestMove(mutationArr, noTurnUpdate) {
    const Fen = new FenUtils();

    const currentBasicFen = Fen.getBasicFen();

    if(currentBasicFen != lastBasicFen) {
        lastBasicFen = currentBasicFen;

        if(mutationArr && !noTurnUpdate) {
            const attributeMutationArr = mutationArr.filter(m => m.target.classList.contains('piece') && m.attributeName == 'class');

            if(attributeMutationArr?.length) {
                turn = Fen.getPieceOppositeColor(Fen.getFenCodeFromPieceElem(attributeMutationArr[0].target));
                Interface.log(`Turn updated to ${turn}!`);
            }
        }

        reloadChessEngine();
        Interface.stopBestMoveProcessingAnimation();

        const currentFen = Fen.getFen();

        Interface.board.removeBestMarkings();
        Interface.board.updateBoardFen(currentFen);

        Interface.log('Sending best move request to the engine!');
        engine.postMessage(`position fen ${currentFen}`);

        if(playerColor == null || turn == playerColor) {
            engine.postMessage(GM_getValue(dbValues.engineDepthQuery));
        }
    }
}

function observeNewMoves() {
    updateBestMove();

    const boardObserver = new MutationObserver(mutationArr => {
        const lastPlayerColor = playerColor;

        updatePlayerColor();

        if(playerColor != lastPlayerColor) {
            Interface.log(`Player color changed from ${lastPlayerColor} to ${playerColor}!`);
            updateBestMove(mutationArr, true);
        } else {
            updateBestMove(mutationArr);
        }
    });

    boardObserver.observe(chessBoardElem, { childList: true, subtree: true, attributes: true });
}

function initializeGUI() {
    if(Gui?.document) return;

    const Fen = new FenUtils();

    Gui.addPage("Main", `
    <div class="rendered-form">
        <script>${GM_getResourceText('jquery.js')}</script>
        <script>${GM_getResourceText('chessboard.js')}</script>
        <div class="card">
            <div class="card-body">
                <div class="main-title-bar">
                    <h5 class="card-title">Live Chessboard</h5>
                    <p id="best-move-progress"></p>
                </div>

                <div id="board" style="width: 447px"></div>
            </div>
            <div id="orientation" class="hidden"></div>
            <div class="card-footer sideways-card">FEN <small class="text-muted"><div id="fen"></div></small></div>
        </div>
        <script>
        const orientationElem = document.querySelector('#orientation');
        const fenElem = document.querySelector('#fen');

        let board = ChessBoard('board', {
            pieceTheme: '${repositoryRawURL}/content/chesspieces/{piece}.svg',
            position: 'start',
            orientation: '${playerColor == 'b' ? 'black' : 'white'}'
        });

        const orientationObserver = new MutationObserver(() => {
            board = ChessBoard('board', {
                pieceTheme: '${repositoryRawURL}/content/chesspieces/{piece}.svg',
                position: fenElem.textContent,
                orientation: orientationElem.textContent == 'b' ? 'black' : 'white'
            });
        });

        const fenObserver = new MutationObserver(() => {
            board.position(fenElem.textContent);
        });

        orientationObserver.observe(orientationElem, { attributes: true,  childList: true,  characterData: true });
        fenObserver.observe(fenElem, { attributes: true,  childList: true,  characterData: true });
        </script>
    </div>
    `);

    Gui.addPage('Log', `
    <div class="rendered-form">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Userscript Log</h5>
                <ul class="list-group" id="userscript-log-container"></ul>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Engine Log</h5>
                <ul class="list-group" id="engine-log-container"></ul>
            </div>
        </div>
    </div>
    `);

    const depth = engineEloArr.findIndex(x => x.data == GM_getValue(dbValues.engineDepthQuery));

    Gui.addPage('Settings', `
    <div class="rendered-form">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Engine</h5>
                <div class="form-group field-select-engine">
                    <select class="form-control" name="select-engine" id="select-engine">
                        <option value="option-lozza" selected="true" id="select-engine-0">Lozza</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Engine Strength</h5>
                <input type="range" class="form-range" min="0" max="11" value=${depth} id="depth-range">
            </div>
            <div class="card-footer sideways-card">Elo <small id="elo">${getEloDescription(getCurrentEngineElo())}</small></div>
        </div>
    </div>
    `);

    Gui.addPage('About', `
    <div class="rendered-form">
        <div class="card">
            <div class="card-body">
                <p class="lead">
                  <b>A.C.A.S</b> <i>(Advanced Chess Assistance System)</i> is an advanced chess assistance system which enhances your chess performance with cutting-edge real-time move analysis.
                </p>
            </div>
            <div class="card-footer sideways-card">Developers <small>Haka</small></div>
            <div class="card-footer sideways-card">Version <small>1.0</small></div>
            <div class="card-footer sideways-card">Repository <a href="${repositoryURL}" target="_blank">A.C.A.S</a></div>
        </div>
    </div>
    `);
}

function openGUI() {
    if(Gui?.document) return;

    Interface.log(`Opening GUI!`);

    Gui.open(() => {
        const depthRangeElem = Gui.document.querySelector('#depth-range');
        const eloElem = Gui.document.querySelector('#elo');

        depthRangeElem.onchange = () => {
            const depth = depthRangeElem.value;
            const engineEloObj = engineEloArr[depth];

            const description = getEloDescription(engineEloObj.elo);
            const engineQuery = engineEloObj.data;

            GM_setValue(dbValues.engineDepthQuery, engineQuery);

            eloElem.innerText = description;
        };

        observeNewMoves();

        window.onunload = () => {
            if(Gui.window && !Gui.window.closed) {
                Gui.window.close();
            }
        };

        const isWindowClosed = setInterval(() => {
            if(Gui.window.closed) {
                clearInterval(isWindowClosed);

                engine.terminate();
            }
        }, 1000);

        Interface.log('Initialized!');
    });
}

function reloadChessEngine() {
    Interface.log(`Reloading the chess engine!`);

    engine.terminate();
    loadChessEngine();
}

function loadChessEngine() {
    if(!lozzaObjectURL) {
        lozzaObjectURL = URL.createObjectURL(new Blob([GM_getResourceText('lozza.js')], {type: 'application/javascript'}));
    }

    if(lozzaObjectURL) {
        engine = new Worker(lozzaObjectURL);

        engine.onmessage = e => {
            if(e.data.includes('bestmove')) {
                const [from, to] = separateMoveCodes(e.data);
                const isPlayerTurn = playerColor == turn;

                Interface.board.markBestMove(from, to, isPlayerTurn);
                Interface.stopBestMoveProcessingAnimation();
            }

            else if(e.data.includes('info')) {
                const infoObj = extractInfo(e.data);

                if(infoObj?.depth) {
                    Interface.updateBestMoveProgress(`Depth ${infoObj.depth}`);
                }
            }

            Interface.engineLog(e.data);
        };

        engine.postMessage('ucinewgame');

        Interface.log(`Loaded the chess engine!`);
    }
}

function initializeDatabase() {
    if(!GM_getValue(dbValues.engineDepthQuery)) {
        GM_setValue(dbValues.engineDepthQuery, 'go depth 5');
    }

    Interface.log(`Initialized the database!`);
}

async function updatePlayerColor() {
    const boardOrientation = Interface.getBoardOrientation();

    playerColor = boardOrientation;
    turn = boardOrientation;

    Interface.board.updateBoardOrientation(playerColor);
}

async function initialize() {
    Interface = new InterfaceUtils();

    const boardOrientation = Interface.getBoardOrientation();

    turn = boardOrientation;

    initializeDatabase();

    loadChessEngine();

    updatePlayerColor();

    if(!Gui?.document) {
        initializeGUI();
    }

    openGUI();
}

if(typeof GM_registerMenuCommand) {
    const menu_command_id = GM_registerMenuCommand("Open A.C.A.S", e => {
        if(chessBoardElem) {
            initialize();
        }
    }, 's');
}

const waitForChessBoard = setInterval(() => {
    const boardElem = document.querySelector('chess-board');
    const firstPieceElem = document.querySelector('.piece');

    if(boardElem && firstPieceElem && chessBoardElem != boardElem) {
        chessBoardElem = boardElem;

        initialize();
    }
}, 1000);
