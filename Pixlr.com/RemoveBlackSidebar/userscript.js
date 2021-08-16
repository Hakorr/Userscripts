// ==UserScript==
// @name        [Pixlr] Remove Black Sidebar
// @namespace   HKR
// @match       https://pixlr.com/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Removes the annoying black sidebar that Adblockers didn't remove.
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// @grant GM_addStyle
// ==/UserScript==

GM_addStyle("#workspace { right: 0px !important; }");

const elementToWatch = '#slot';
document.arrive(elementToWatch, function () {
	document.getElementById("slot").remove();
});
