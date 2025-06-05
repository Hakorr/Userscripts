// ==UserScript==
// @name:tr     Duck.AI Sohbet Arama 🔎 (DuckDuckGo’nun Yapay Zekası)
// @name:fr     Recherche de Chat Duck.AI 🔎 (IA de DuckDuckGo)
// @name:id     Pencarian Chat Duck.AI 🔎 (AI dari DuckDuckGo)
// @name:pt-BR  Pesquisa de Chat Duck.AI 🔎 (IA do DuckDuckGo)
// @name:es     Búsqueda de Chat Duck.AI 🔎 (IA de DuckDuckGo)
// @name:pl     Wyszukiwarka Czatów Duck.AI 🔎 (AI DuckDuckGo)
// @name:vi     Tìm kiếm Chat Duck.AI 🔎 (AI của DuckDuckGo)
// @name:uk     Пошук чатів Duck.AI 🔎 (ШІ від DuckDuckGo)
// @name:it     Ricerca Chat Duck.AI 🔎 (IA di DuckDuckGo)
// @name:nl     Duck.AI Chatzoeker 🔎 (AI van DuckDuckGo)
// @name:ru     Поиск чатов Duck.AI 🔎 (ИИ от DuckDuckGo)
// @name:ja     Duck.AI チャット検索 🔎（DuckDuckGo の AI)
// @name        Duck.AI Chat Search 🔎 (DuckDuckGo's AI)
// @name:ko     Duck.AI 채팅 검색기 🔎 (DuckDuckGo의 AI)
// @name:zh-CN  Duck.AI 聊天搜索 🔎（DuckDuckGo 的 AI)
// @name:de     Duck.AI Chatsuche 🔎 (DuckDuckGo KI)
// @description:it Aggiunge una barra di ricerca alla chat Duck.AI per trovare facilmente i messaggi nelle conversazioni.
// @description:fr Ajoute une barre de recherche à Duck.AI pour rechercher facilement des messages dans vos discussions.
// @description:pt-BR Adiciona uma barra de pesquisa ao Duck.AI para facilitar a busca de mensagens nas conversas.
// @description:tr Duck.AI sohbetine bir arama çubuğu ekler; böylece önceki mesajlarınızı kolayca arayabilirsiniz.
// @description:id Menambahkan bilah pencarian ke Duck.AI untuk memudahkan pencarian pesan dalam obrolan Anda.
// @description:pl Dodaje pasek wyszukiwania do Duck.AI, umożliwiając łatwe wyszukiwanie wiadomości w czatach.
// @description:vi Thêm thanh tìm kiếm vào Duck.AI để bạn dễ dàng tìm lại các tin nhắn trong cuộc trò chuyện.
// @description:nl Voegt een zoekbalk toe aan Duck.AI waarmee je eenvoudig berichten in je chats kunt zoeken.
// @description Adds a chat search bar to Duck.AI so you can easily search messages in your conversations.
// @description:es Añade una barra de búsqueda a Duck.AI para encontrar fácilmente mensajes en tus chats.
// @description:ru Добавляет строку поиска в Duck.AI, чтобы вы могли легко находить сообщения в чатах.
// @description:de Fügt Duck.AI eine Suchleiste hinzu, um Nachrichten in Chats einfach zu finden.
// @description:ja Duck.AI に検索バーを追加し、チャット内のメッセージを簡単に検索できるようにします。
// @description:uk Додає панель пошуку в Duck.AI, щоб легко знаходити повідомлення у чатах.
// @description:ko Duck.AI 채팅에 검색창을 추가하여 이전 메시지를 쉽게 찾을 수 있습니다.
// @description:zh-CN 为 Duck.AI 聊天添加搜索栏，让你轻松搜索聊天中的消息内容。
// @require     https://cdn.jsdelivr.net/npm/fuse.js@7.1.0
// @supportURL  https://github.com/Hakorr/Userscripts
// @match       https://duckduckgo.com/*duckai*
// @run-at      document-load
// @grant       GM_addStyle
// @namespace   HKR
// @author      HKR
// @version     1.0
// ==/UserScript==

const fuseOptions = {
    includeScore: true,
    includeMatches: true,
    threshold: 0.2,
    ignoreLocation: true,
    distance: Infinity,
    keys: [
        'title',
        'messages.content',
        'messages.parts.text'
    ],
};

function truncate(str, maxLength, fromStart = false) {
    if(str.length <= maxLength) return str;

    if(fromStart) {
        return '...' + str.slice(str.length - maxLength + 3);
    } else {
        return str.slice(0, maxLength - 3) + '...';
    }
}

function getStoredChats() {
    try {
        return JSON.parse(localStorage.savedAIChats).chats;
    } catch {}

    return null;
}

if(!getStoredChats()) return;

const donateLink = `<p class="dsu-donate-link"><a href="https://liberapay.com/Haka/donate"><svg xmlns="http://www.w3.org/2000/svg" width="83" height="30"><rect id="back" fill="#f6c915" x="1" y=".5" width="82" height="29" rx="4"></rect><svg viewBox="0 0 80 80" height="16" width="16" x="7" y="7"><g transform="translate(-78.37-208.06)" fill="#1a171b"><path d="m104.28 271.1c-3.571 0-6.373-.466-8.41-1.396-2.037-.93-3.495-2.199-4.375-3.809-.88-1.609-1.308-3.457-1.282-5.544.025-2.086.313-4.311.868-6.675l9.579-40.05 11.69-1.81-10.484 43.44c-.202.905-.314 1.735-.339 2.489-.026.754.113 1.421.415 1.999.302.579.817 1.044 1.546 1.395.729.353 1.747.579 3.055.679l-2.263 9.278"></path><path d="m146.52 246.14c0 3.671-.604 7.03-1.811 10.07-1.207 3.043-2.879 5.669-5.01 7.881-2.138 2.213-4.702 3.935-7.693 5.167-2.992 1.231-6.248 1.848-9.767 1.848-1.71 0-3.42-.151-5.129-.453l-3.394 13.651h-11.162l12.52-52.19c2.01-.603 4.311-1.143 6.901-1.622 2.589-.477 5.393-.716 8.41-.716 2.815 0 5.242.428 7.278 1.282 2.037.855 3.708 2.024 5.02 3.507 1.307 1.484 2.274 3.219 2.904 5.205.627 1.987.942 4.11.942 6.373m-27.378 15.461c.854.202 1.91.302 3.167.302 1.961 0 3.746-.364 5.355-1.094 1.609-.728 2.979-1.747 4.111-3.055 1.131-1.307 2.01-2.877 2.64-4.714.628-1.835.943-3.858.943-6.071 0-2.161-.479-3.998-1.433-5.506-.956-1.508-2.615-2.263-4.978-2.263-1.61 0-3.118.151-4.525.453l-5.28 21.948"></path></g></svg><text fill="#1a171b" text-anchor="middle" font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-weight="700" font-size="14" x="50" y="20">Donate</text></svg></a></p>`;

const searchBarElem = document.createElement('input');
      searchBarElem.type = 'text';
      searchBarElem.placeholder = 'Search for messages...';
      searchBarElem.onchange = search;
      searchBarElem.name = 'dsu-search';

const containerElem = document.createElement('dialog');
      containerElem.id = 'DuckSearchUserscript';
      containerElem.innerHTML = `${donateLink} <div class="dsu-result-container"></div>`;
      containerElem.prepend(searchBarElem);
      containerElem.addEventListener('click', (event) => {
          if(event.target === containerElem) {
              containerElem.close();
          }
      });

const resultContainer = containerElem.querySelector('.dsu-result-container');
const openBtn = document.createElement('div');
      openBtn.id = 'dsu-open-btn';
      openBtn.innerText = 'Search...';
      openBtn.onclick = () => containerElem.showModal();

document.body.appendChild(containerElem);
document.body.appendChild(openBtn);

function getChatElemByTitle(title) {
    const divs = document.querySelectorAll('div[title]');

    for(const div of divs) {
        if(div.title.includes(title)) {
            return div;
        }
    }

    return null;
}

function getMessageElem(chatId, i = 0, isUser = false) {
    const index = isUser ? Math.floor(i / 2) : i;

    const id = `${chatId}-assistant-message-${index}-1`;
    const elem = document.querySelector(`section [id="${id}"]`);

    return isUser ? elem?.parentElement?.querySelector('div') : elem;
}

function createResultElem(result) {
    const { item, matches } = result;
    const { title, chatId } = item;
    const messages = item.messages;

    const resultElem = document.createElement('div');
          resultElem.classList.add('dsu-result');
          resultElem.innerHTML = `
              <div class="dsu-result-title"></div>
              <div class="dsu-result-match-container"></div>
          `;

    const resultTitleElem = resultElem.querySelector('.dsu-result-title');
    const matchContainerElem = resultElem.querySelector('.dsu-result-match-container');
    const truncatedTitle = truncate(item.title, 30).replaceAll('\n', ' ');

    resultTitleElem.innerText = `Chat | ${truncatedTitle}`;

    matches.forEach(match => {
        const { key, value, indices, refIndex } = match;
        const isTitle = key === 'title';
        const isUser = key === 'messages.content';
        const isAI = key === 'messages.parts.text';

        const tag = isTitle ? 'title' : 'message';

        const fancyTag = isTitle
          ? tag
          : `${tag}${isUser ? ' | You' : isAI ? ' | AI' : ''}`;

        const matchElem = document.createElement('div');
              matchElem.classList.add('dsu-match');
              matchElem.classList.add(tag);
              matchElem.innerHTML = `
                  <div class="dsu-match-tag"></div>
                  <div class="dsu-match-text"></div>
              `;

        // When match elem is clicked, open the chat and highlight the message the match is from
        matchElem.onclick = () => {
            containerElem.close();

            const chatElem = getChatElemByTitle(title);

            chatElem?.click();

            setTimeout(() => {
                const messageElem = getMessageElem(chatId, refIndex, isUser);

                messageElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                messageElem.classList.add('dsu-highlight');

                setTimeout(() => messageElem.classList.remove('dsu-highlight'), 5000);
            }, 250);
        };

        const matchTagElem = matchElem.querySelector('.dsu-match-tag');
        const matchTextElem = matchElem.querySelector('.dsu-match-text');
              matchTagElem.classList.add(tag);
              matchTagElem.textContent = fancyTag;

        let lastIndex = 0;

        for(const [start, end] of indices) {
            if(start > lastIndex) {
                let beforeText = value.slice(lastIndex, start);
                matchTextElem.appendChild(document.createTextNode(beforeText));
            }

            const mark = document.createElement('mark');
            mark.textContent = value.slice(start, end+1);
            matchTextElem.appendChild(mark);

            lastIndex = end;
        }

        if(lastIndex < value.length) {
            let afterText = value.slice(lastIndex + 1);
            matchTextElem.appendChild(document.createTextNode(afterText));
        }


        matchContainerElem.appendChild(matchElem);
    });

    return resultElem;
}

function render(results) {
    resultContainer.innerHTML = '';

    results.forEach(x => {
        const elem = createResultElem(x);
        resultContainer.appendChild(elem);
    });

    if(!results || results?.length === 0) {
        const noResultsText = document.createElement('div');
              noResultsText.classList.add('dsu-no-match-text');
              noResultsText.innerText = 'The search yielded no results. (╥﹏╥)';

        resultContainer.appendChild(noResultsText);
    }
}

function search(e) {
    const query = e?.target?.value?.toLowerCase();

    if(query?.length === 0) {
        resultContainer.innerHTML = '';
        return;
    }

    const chats = getStoredChats();
    const results = new Fuse(chats, { ...fuseOptions, 'minMatchCharLength':  query.length })
                        .search(query);

    render(results);
}

GM_addStyle(`
#DuckSearchUserscript {
    height: fit-content;
    border: 1px solid #333333;
    width: 90%;
    max-width: 800px;
    max-height: 90%;
    background: #111;
    color: white;
    border-bottom-width: 5px;
    border-radius: 5px;
    box-shadow: 0px 0px 12px 0px #000000;
    position: relative;
}
#DuckSearchUserscript::backdrop {
    background: rgb(0 31 255 / 5%);
    backdrop-filter: blur(10px);
}
#DuckSearchUserscript input {
    font-size: 18px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
}
.dsu-result {
    width: 100%;
    height: fit-content;
    padding: 10px 15px;
    border-bottom-width: 3px;
    box-sizing: border-box;
}
.dsu-result-match-container {
    background: #1c1c1c;
    box-shadow: inset 0px 0px 15px 8px #111;
    padding: 20px;
    border-radius: 3px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}
.dsu-match {
    background: rgb(51 44 69);
    padding: 10px;
    border-radius: 5px;
    position: relative;
    padding-top: 21px;
    border: 1px solid grey;
    border-bottom-width: 3px;
    width: fit-content;
    box-shadow: inset 1px -3px 10px 0px black;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
    user-select: none;
    width: 100%;
    box-sizing: border-box;
}
.dsu-result:first-of-type {
    margin-top: 20px;
}
.dsu-match.title {
    background: rgb(52 64 91);
}
.dsu-match-tag.title {
    background: #647ebb;
}
.dsu-match:hover {
    transform: scale(1.02);
}
.dsu-match:active {
    transform: scale(1);
}
.dsu-match-tag {
    text-transform: capitalize;
    font-weight: 600;
    position: absolute;
    top: -10px;
    left: -5px;
    background: #6c589f;
    border: 1px solid grey;
    border-radius: 15px;
    padding: 0 10px;
    box-shadow: inset 0px 5px 10px 0px black;
    border-top-width: 2px;
    white-space: nowrap;
}
.dsu-match-text {
    font-weight: 500;
    font-size: 16px;
}
.dsu-match-text mark {
    font-weight: 900;
}
.message .dsu-match-text mark {
    background-color: #d99dff;
}
.title .dsu-match-text mark {
    background-color: #96b1f1;
}
.dsu-result-container {
    max-height: 80vh;
    overflow: hidden;
    overflow-y: scroll;
}
.dsu-result-title {
    font-weight: 700;
    font-size: 1.25em;
    border-bottom: 2px solid #313131;
    margin-bottom: 5px;
    border-radius: 3px;
    padding: 5px;
}
.dsu-no-match-text {
    padding: 30px;
    font-weight: 700;
    font-size: 16px;
    background: #1e0000;
    color: red;
    border: 1px solid #212121;
    border-radius: 5px;
}
#dsu-open-btn {
    width: fit-content;
    height: fit-content;
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    background: #1c1c1c;
    color: white;
    padding: 7px 70px;
    border-radius: 5px;
    border: 1px solid #2f2f2f;
    border-bottom-width: 3px;
    color: #6f6f6f;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
}
#dsu-open-btn:hover {
    background: #1e1e1e;
}
.dsu-highlight {
    transition: all 0.5s ease;
    background-color: rgb(153 110 237 / 88%) !important;
    box-shadow: 0 0 20px 0px rgb(153 110 237);
    border-radius: 5px;
}
.dsu-donate-link {
    margin-top: 5px;
    position: absolute;
    right: 22px;
    top: 13px;
}
`);
