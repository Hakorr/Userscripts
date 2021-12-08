// ==UserScript==
// @name        [Aternos] AntiAntiAdblock
// @namespace   HKR
// @match       https://aternos.org/*
// @grant       none
// @version     2.0
// @author      HKR
// @description Removes all the adblock reminders without a hussle.
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @run-at      document-start
// ==/UserScript==

/* onbeforescriptexecute - https://github.com/Ray-Adams/beforeScriptExecute-Polyfill 
Makes catching all web requests and blocking them if necessary possible. */
(() => {
    'use strict';

    if ('onbeforescriptexecute' in document) return;

    const BseEvent = new Event('beforescriptexecute', {
        bubbles: true,
        cancelable: true
    });

    const observerCallback = (mutationsList) => {
        for (let mutationRecord of mutationsList) {
            for (let node of mutationRecord.addedNodes) {
                if (node.tagName !== 'SCRIPT') continue;
                
                // Adds functionality to document.onbeforescriptexecute
                if (typeof document.onbeforescriptexecute === 'function') {
                    document.addEventListener(
                        'beforescriptexecute',
                        document.onbeforescriptexecute,
                        { once: true }
                    );
                };
                
                // Returns false if preventDefault() was called
                if (!node.dispatchEvent(BseEvent)) {
                    node.remove();
                };
            };
        };
    };
    
    const scriptObserver = new MutationObserver(observerCallback);
    scriptObserver.observe(document, { childList: true, subtree: true });
})();

//A new web request initiated
document.onbeforescriptexecute = (e) => {
  //If it requests a base64 encoded js file
  if (e.target.src.includes('data:text/javascript;base64,')) {
    //Block it
    e.preventDefault();
  }
}

//Found advertisement element on document
document.arrive('.ad', function () {
    //Remove all the nondeleted advertisement elements
    Array.from(document.querySelectorAll(".ad")).forEach(ad => ad.setAttribute("style","display: none;"));
});

//Found start button on document
document.arrive('#start', function () {
    //Patch the start button to make it functional
    document.querySelector("#start").setAttribute("onclick","start()");
});

//Document loaded
window.addEventListener('load', function () {
    removeLayer();
    $(document).mouseenter(function () {
        removeLayer();
    });
});

//Find and remove a restrictive top element
function removeLayer() {
    Array.from(document.querySelectorAll("*[style]")).forEach(elim => {
        if(elim.getAttribute("style").includes("top: 0px;"))
            elim.style += "top: -1px";
    });
}
