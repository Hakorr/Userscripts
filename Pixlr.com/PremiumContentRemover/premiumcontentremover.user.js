// ==UserScript==
// @name         [Pixlr X] Premium Content Remover
// @version      2.1
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
    "#cutout-auto",
    "#modal-pop"
];

function handlePremiumElement(elem) {
    console.log(`${userScriptName} Removed a premium element! (${count++})`);
  
    //Check by element class
    switch(elem.getAttribute("class")) {
      case "button small outline pad-20 premium":
        elem.style.display = "none";
        console.log(elem);
        return;
    }
  
    //Check by element's parent's class
    switch(elem.parentElement.getAttribute("class")) {
      case "template-box large": "template-box";
          elem.parentElement.outerHTML = "";
          console.log(elem);
          return;

      case "element-group":
          elem.remove();
          console.log(elem);
          return;
    }
    
    //Default
    elem.outerHTML = "";
    console.log(elem);
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
