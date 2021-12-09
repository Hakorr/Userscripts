// ==UserScript==
// @name         [Pixlr X] Premium Content Remover
// @version      2.0
// @description  Removes premium features on Pixlr.com, because they are just on your way.
// @author       HKR
// @match        https://pixlr.com/*
// @grant        none
// @namespace    HKR
// @supportURL   https://github.com/Hakorr/Userscripts/issues
// @require      https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @grant        GM_addStyle
// ==/UserScript==

const userScriptName = "[Premium Content Remover]";
let count = 1;
console.log(`${userScriptName} Started!`);

GM_addStyle('#sneaky { visibility: hidden !important; }');

const removeList = [
    ".premium",
    ".get-premium",
    "#try-premium",
    "#tool-glitch",
    "#tool-focus",
    "#tool-dispersion",
    "#cutout-auto"
];

function handlePremiumElement(elem) {
    switch(elem.parentElement.getAttribute("class")) {
        case "template-box large":
            elem.parentElement.outerHTML = "";
            break;

        case "template-box":
            elem.parentElement.outerHTML = "";
            break;

        default:
            elem.outerHTML = "";
            break;
    }
    console.log(`${userScriptName} Removed a premium element! (${count++})`);
}

function getPremiumElements(elem) {
    Array.from(document.querySelectorAll(elem)).forEach(elem => {
        handlePremiumElement(elem);
    });
}

function remove(elem) {
    getPremiumElements(elem);
    document.arrive(elem, function () {
        getPremiumElements(elem);
    });
}

removeList.forEach(elem => {
    remove(elem);
});
