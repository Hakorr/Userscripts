// ==UserScript==
// @name        [Flightradar24] Bypass Timeout
// @namespace   HKR
// @match       https://www.flightradar24.com/*
// @grant       none
// @version     1.2
// @author      HKR
// @description Bypasses the 30-min timeout
// @run-at      document-start
// ==/UserScript==

function modifyConfigString(configStr, key, value) {
    let regex = new RegExp(`("${key}":\\s*)[^,]+`, 'g');
    let newConfigStr = configStr.replace(regex, `$1${value}`);

    return newConfigStr;
}

function patchNode(node) {
    const changeArr = [
        ['map.timeout.mins', 0]
        // room for more changes...
    ];

    changeArr.forEach(x => node.innerText = modifyConfigString(node.innerText, x[0], x[1]));
}

new MutationObserver(mutationsList => {
    mutationsList.forEach(mutationRecord => {
        [...mutationRecord.addedNodes]
          .filter(node => node.tagName === 'SCRIPT')
          .forEach(node => patchNode(node));
    });
}).observe(document, { childList: true, subtree: true });
