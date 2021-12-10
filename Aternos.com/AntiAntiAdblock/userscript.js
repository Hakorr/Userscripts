// ==UserScript==
// @name        [Aternos] AntiAntiAdblock
// @namespace   HKR
// @match       https://aternos.org/*
// @grant       none
// @version     2.3
// @author      HKR
// @description Removes all the adblock reminders without a hussle.
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// @home-url    https://github.com/Hakorr/Userscripts/tree/main/Aternos.com/AntiAntiAdblock
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @run-at      document-start
// ==/UserScript==

/* Note to the Aternos developers who are constantly wasting their precious time on this script, please stop.
    - I'm sorry for making the script, but at the same not. I will personally never take my adblock off, so you'd get no (ad) profits from me (or other people like me) either way.
    - If I remember correctly, you also sell user data, that should keep you afloat.
    - I'm not trying to advertise the script to everyone, it's only on GreasyFork and Github and only those who really, really want an antiantiadblocker can find it.
*/

//Remove a base64 encoded JS script that ads the fullscreen anti ablock message (This is incase onbeforescriptexecute fails)
document.arrive('[src*="data:text/javascript;base64"]', function () { 
    document.querySelector('[src*="data:text/javascript;base64"]').remove();
});

//Found the advertisement element on document -> Hide all the nondeleted advertisement elements
document.arrive('.ad', function () { 
    Array.from(document.querySelectorAll(".ad")).forEach(ad => ad.setAttribute("style","display: none;")); 
});

//Found the start button on document -> Patch the start button (To make it functional)
document.arrive('#start', function () { 
    document.querySelector("#start").onclick = function() {
        start();
    }
});

//Found the navigation open/close button on document -> Patch the navigation open/close button (To make it functional)
document.arrive('.navigation-toggle', function () { 
    document.querySelector(".navigation-toggle").onclick = function(){
        let nav = document.querySelector(".navigation"); 
        nav.setAttribute("class", nav.getAttribute("class") == "navigation" ? "navigation toggled" : "navigation");
    }
});

//Found the sidebar element on document -> Hide sidebar (Only used for advertisements)
document.arrive('.sidebar', function () { 
    document.querySelector(".sidebar").setAttribute("style","display: none;"); 
});

/* onbeforescriptexecute - https://github.com/Ray-Adams/beforeScriptExecute-Polyfill 
Makes catching all web requests and blocking them if necessary possible. */

/* Updated it to randomize the name, because of Aternos' countermeasures */

let randomNum = max => Math.floor(Math.random() * max);
const scriptExecuteName = Math.random().toString(36).substring(2, randomNum(40) + 5);

(() => {
    'use strict';

    if ('onbeforescriptexecute' in document) return;

    const BseEvent = new Event(scriptExecuteName, {
        bubbles: true,
        cancelable: true
    });

    const observerCallback = (mutationsList) => {
        for (let mutationRecord of mutationsList) {
            for (let node of mutationRecord.addedNodes) {
                if (node.tagName !== 'SCRIPT') continue;
                
                // Adds functionality to document.onbeforescriptexecute
                if (typeof document.scriptExecuteName === 'function') {
                    document.addEventListener(
                        scriptExecuteName,
                        document.scriptExecuteName,
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
document.scriptExecuteName = (e) => {
    //If it requests a base64 encoded js file
    if (e.target.src.includes('data:text/javascript;base64')) {
        //Block it
        e.preventDefault();
    }
}

//Find and "hide" a restrictive top element
function removeLayer() { Array.from(document.querySelectorAll("[style]")).forEach(elim => { if(elim.getAttribute("style").includes("top: 0;")) elim.style += "top: -1px"; }); }

//Document loaded
window.addEventListener('load', function () {
    removeLayer();
    $(document).mouseenter(function () {
        removeLayer();
    });
});
