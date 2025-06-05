// ==UserScript==
// @name        Duck.ai Search Messages
// @namespace   HKR
// @match       https://duckduckgo.com/*duckai*
// @grant       none
// @version     1.0
// @author      HKR
// @description Adds a search bar to search text from your chats!
// @require     https://cdn.jsdelivr.net/npm/fuse.js@7.1.0
// @run-at      document-load
// @grant       GM_addStyle
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

const searchBarElem = document.createElement('input');
      searchBarElem.type = 'text';
      searchBarElem.placeholder = 'Search for messages...';
      searchBarElem.onchange = search;
      searchBarElem.name = 'dsu-search';

const containerElem = document.createElement('dialog');
      containerElem.id = 'DuckSearchUserscript';
      containerElem.innerHTML = `<div class="dsu-result-container"></div>`;
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
    gap: 10px;
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
    margin-top: 20px;
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
    border-radius: 0 0 5px 5px;
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
`);
