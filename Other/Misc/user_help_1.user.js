// ==UserScript==
// @name        Bing AI Copy Code Button
// @namespace   -
// @match       http*://*bing*/*
// @grant       GM_setClipboard
// @version     1.0
// @author      -
// @description Adds a copy code button after every code block on Bing AI Chat, made for u/ale3smm
// @run-at      document-start
// ==/UserScript==

let started = false;
let cibSerp;
let cibConvo;
let mainContainer;
let handledComments = [];

function createCopyButton(messageElem) {
    const copyBtn = document.createElement('button');
    copyBtn.id = 'custom-copy-btn';
    copyBtn.innerText = 'Copy';
    copyBtn.onclick = e => GM_setClipboard(messageElem.textContent, 'text');

    return copyBtn;
}

function addCommentTool(turnElem) {
    const waitForRes = setInterval(() => {
        const botResponse = turnElem?.querySelector('.response-message-group')?.shadowRoot;
        const messageElem = botResponse?.querySelector('.cib-message-main[type="text"]')?.shadowRoot; //[type="text"] is really important
        const content = messageElem?.querySelector('.content');
        const feedback = messageElem?.querySelector('cib-feedback');

        if(feedback) {
            clearInterval(waitForRes);

            const codeBlocks = content.querySelectorAll('code');

            codeBlocks.forEach(codeBlockElem => codeBlockElem.after(createCopyButton(codeBlockElem)));
        }
    }, 250);
}

function addCommentTools() {
    const messageTurns = [...mainContainer.querySelectorAll('cib-chat-turn')].map(turnElem => turnElem.shadowRoot);

    messageTurns.forEach(turnElem => {
        if (handledComments.includes(turnElem)) return;

        handledComments.push(turnElem);

        addCommentTool(turnElem);
    });
}

function startChatObserve() {
    new MutationObserver(() => {
        addCommentTools();
    }).observe(mainContainer, { childList: true, subtree: true });
}

new MutationObserver(() => {
    cibSerp = document.querySelector('cib-serp')?.shadowRoot;
    cibConvo = cibSerp?.querySelector('#cib-conversation-main')?.shadowRoot;
    mainContainer = cibConvo?.querySelector('#cib-chat-main');

    if(mainContainer && !started) {
        console.log('The necessary elements have been loaded and we can start monitoring new messages.');

        started = true;

        startChatObserve();
    }
}).observe(document.body, { childList: true, subtree: true });
