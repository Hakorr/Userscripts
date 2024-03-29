// ==UserScript==
// @name        [Sanakirja] Enchantments
// @namespace   HKR
// @match       https://www.sanakirja.org/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Various enchantments for Sanakirja.org
// @run-at      document-load
// ==/UserScript==

['iframe[src="//vg.is.fi/hs-sanakirja/"]', 'iframe[src="https://vg.is.fi/hs-sanakirja/"]', '[id^=sp_message_container]'].forEach(query => {
    const interval = setInterval(() => {
        const elem = document.querySelector(query);

        if(typeof elem == "object" && elem != null) {
            elem.remove();

            clearInterval(interval);
        }
    }, 100);
});
