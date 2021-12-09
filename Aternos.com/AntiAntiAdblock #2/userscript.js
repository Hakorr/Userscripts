// ==UserScript==
// @name        [Aternos] AntiAntiAdblock [2nd method]
// @namespace   HKR
// @match       https://aternos.org/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Removes all the adblock reminders. A bit slow and laggy.
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @run-at      document-load
// ==/UserScript==

window.addEventListener('load', function () {
    /* REMOVE HIDDEN CSS RULES */
    Array.from(document.querySelectorAll("[style]")).forEach(elem => { 
        if(elem.getAttribute("style").includes("display: none !important; height: 0px !important;")) {
            elem.style = ""; 
        }
        if(elem.getAttribute("style").includes("height: 0px; width: 0px; overflow: hidden;")) {
            elem.style = ""; 
        }
    });
});
 
const url = window.location.href;
const aternos = page => `https://aternos.org/${page}/`;
const fixedPage = () => `.page-${url.split("/").filter(e => e).pop()}`;

function copyPaste(element) {
    document.arrive(element, function () { document.querySelector(fixedPage()).appendChild(document.querySelector(element).parentElement); });
}

/* COPY (HIDDEN) INFO ELEMENTS TO THE PAGE VIEW */
switch(url) {
    case aternos("server"):
        copyPaste(".server-ip")
        break;
        
    case aternos("options"):
        copyPaste(".config-file-wrapper")
        break;
        
    case aternos("console"):
        copyPaste(".console")
        break;
        
    case aternos("log"):
        copyPaste(".log-title")
        break;
        
    case aternos("players"):
        copyPaste(".playerlist")
        break;
        
    case aternos("software"):
        copyPaste(".software-edition")
        break;
        
    case aternos("files"):
        copyPaste(".files")
        break;
        
    case aternos("worlds"):
        copyPaste(".worldlist")
        break;
        
    case aternos("backups"):
        copyPaste(".backup-connect")
        break;
        
    case aternos("access"):
        copyPaste(".access-list")
        break;

    case aternos("domains"):
        copyPaste(".domains-page");
        break;
}

/* REMOVE FULLSCREEN "ADBLOCK" ALERT */
Array.from(document.querySelectorAll("[style]")).forEach(elem => {
    if(elem.getAttribute("style").includes("top: 0;")) {
        elem.innerHTML = ""; elem.style += "display: none"; 
    }
});

/* CLEAR ADS & SIDEBAR */
Array.from(document.querySelectorAll(".ad")).forEach(ad => ad.setAttribute("style","display: none;")); 

document.querySelector(".sidebar").setAttribute("style","display: none;"); 

/* FIX BUTTONS */
document.querySelector("#start").onclick = function() { start(); }
