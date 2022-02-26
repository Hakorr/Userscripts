// ==UserScript==
// @name        [Flightradar24] Bypass Timeout
// @namespace   HKR
// @match       https://www.flightradar24.com/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Bypasses the 15-min timeout
// @run-at      document-load
// ==/UserScript==

(() => {
    setInterval(() => {
        blackoutMapForTimeout = () => console.log("Bypassed 15-min timeout!");
    }, 1000);
})();
