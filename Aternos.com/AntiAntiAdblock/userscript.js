// ==UserScript==
// @name        [Aternos] AntiAntiAdblock
// @namespace   HKR
// @match       https://aternos.org/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Removes all the adblock reminders without a hussle.
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @run-at      document-start
// ==/UserScript==

unsafeWindow.atob = function(i) {};

document.arrive('.ad', function () {
    //Remove all the nondeleted advertisement elements
    Array.from(document.querySelectorAll(".ad")).forEach(ad => ad.setAttribute("style","display: none;"));
});

document.arrive('#start', function () {
    //Patch the start button to make it functional
    document.querySelector("#start").setAttribute("onclick","start()");
});

function removeLayer() {
    //Find and remove a restrictive top element
    Array.from(document.querySelectorAll("*[style]")).forEach(elim => {
        if(elim.getAttribute("style").includes("top: 0px;"))
            elim.style += "top: -1px";
    });
}

window.addEventListener('load', function () {
    removeLayer();
    $(document).mouseenter(function () {
        removeLayer();
    });
});
