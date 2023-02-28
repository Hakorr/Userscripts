// ==UserScript==
// @name        [Pixlr] Unlimited Saves
// @namespace   HKR
// @match       https://pixlr.com/*/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Bypasses the daily save limit
// @run-at      document-start
// ==/UserScript==

const replacementRegex = /\(\)\s*>=\s*3/g;
const bypassStr = `()=='D'`;

function patchScript(event) {
    const script = event.target;
    const src = script?.src;

    if(src && src.includes('/dist/')) {
        event.preventDefault();

        fetch(src)
            .then(res => res.text())
            .then(text => {
                text = text.replace(replacementRegex, bypassStr);

                if(!text.includes(bypassStr)) {
                    alert(`Daily limit bypass failed, the userscript may be outdated!`);
                }

                const modifiedScript = document.createElement('script');
                      modifiedScript.innerHTML = text;

                script.parentNode.replaceChild(modifiedScript, script);
            });
    }
}

document.addEventListener('beforescriptexecute', patchScript, true);
