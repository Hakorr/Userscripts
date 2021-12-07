// ==UserScript==
// @name        [Aternos] No adblock reminders
// @namespace   HKR
// @match       https://aternos.org/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Removes all the adblock reminders without a hussle.
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @run-at      document-start
// ==/UserScript==

unsafeWindow.atob = function() {};

document.arrive('.ad', function () {
    //Patch the start button to make it functional
    if(document.querySelector("#start")) document.querySelector("#start").setAttribute("onclick","start()");
    //Remove all the nondeleted advertisement elements
    Array.from(document.querySelectorAll(".ad")).forEach(ad => ad.setAttribute("style","display: none;"));
});
