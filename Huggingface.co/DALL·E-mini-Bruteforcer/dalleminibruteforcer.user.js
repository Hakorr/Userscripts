// ==UserScript==
// @name        DALL·E mini Bruteforcer
// @namespace   HKR
// @match       https://hf.space/static/dalle-mini/dalle-mini/index.html
// @match       https://huggingface.co/spaces/dalle-mini/dalle-mini
// @grant       none
// @version     1.0
// @author      HKR
// @description Clicks the run button until success
// ==/UserScript==

(() => {
    if(window.location.hostname == "hf.space") {
        const intervalMs = 5000;

        window.alert = txt => {
            console.error(txt);

            if(txt.includes("Too much traffic")) {
                console.warn(`\n\nWaiting ${intervalMs/1000} seconds and trying again...\n\n`);

                setTimeout(() => document.querySelector(".self-start").click(), intervalMs);
            }
        }
    }
})();
