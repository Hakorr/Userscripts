// ==UserScript==
// @name        [Yle] BetterComments
// @match       https://yle.fi/*
// @grant       none
// @version     1.0
// @author      HKR
// @namespace   HKR
// @description Makes Yle's article comment section better
// @run-at      document-load
// ==/UserScript==

function main(commentsContainerElem) {
    console.log(commentsContainerElem, commentsContainerElem.childNodes);

    [...commentsContainerElem.childNodes].forEach(topCommentElem => {
        const replyCommentContainerElem = topCommentElem.querySelector('ul');

        if(!replyCommentContainerElem) return;

        const buttonContainerElem = topCommentElem.querySelector('button')?.parentElement;

        [...replyCommentContainerElem.childNodes].forEach(replyCommentElem => {
            const commentElem = replyCommentElem.querySelector('*[id*="comment"]');

            commentElem.style.cssText = `
                font-size: 14px;
                background-color: #00b3c726;
            `;
        });

        const hideBtn = document.createElement('button');
            hideBtn.innerText = 'Collapse';
            hideBtn.style.cssText = `
                font-family: "Yle Next";
                font-size: 14px;
                font-weight: 700;
                line-height: 150%;
                background-color: transparent;
                border-color: transparent;
                color: rgb(219, 216, 212);
                vertical-align: top;
                width: 100%;
            `;

        let isCollapsed = false;

        hideBtn.onclick = function() {
            if(isCollapsed) {
                replyCommentContainerElem.style.display = 'block';
                hideBtn.innerText = 'Collapse';
            } else {
                replyCommentContainerElem.style.display = 'none';
                hideBtn.innerText = 'Expand';
            }

            isCollapsed = !isCollapsed;
        }

        hideBtn.click();

        topCommentElem.insertBefore(hideBtn, replyCommentContainerElem);
    });
}

const waitForElemInterval = setInterval(() => {
    const commentsPluginElem = document.querySelector('#yle-comments-plugin');
    const commentsContainerElem = commentsPluginElem?.querySelector('ul[class*="cmnts"]');
    const isFullyLoaded = commentsContainerElem?.childNodes?.length > 0;

    if(isFullyLoaded) {
        clearInterval(waitForElemInterval);

        main(commentsContainerElem);
    }
}, 250);
