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

const removeSideHS = setInterval(() => {
    const elem = document.querySelector('iframe[src="//vg.is.fi/hs-sanakirja/"]')
    if(typeof elem == "object" && elem != null) {
        elem.remove();
        clearInterval(removeSideHS);
    }
}, 100);

const removeBottomHS = setInterval(() => {
    const elem = document.querySelector('iframe[src="https://vg.is.fi/hs-sanakirja/"]')
    if(typeof elem == "object" && elem != null) {
        elem.remove();
        clearInterval(removeBottomHS);
    }
}, 100);

const removeConsentMessage = setInterval(() => {
    const elem = document.querySelector('iframe[title="SP Consent Message"]');
    if(typeof elem == "object" && elem != null) {
        elem.parentElement.remove();
        clearInterval(removeConsentMessage);
    }
}, 100);