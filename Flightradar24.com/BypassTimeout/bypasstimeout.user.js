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
        try {
            dispatcher.features['map.timeout.mins'] = 999999999999;
        } catch {
            // nothing
        }
    }, 1000);
})();
