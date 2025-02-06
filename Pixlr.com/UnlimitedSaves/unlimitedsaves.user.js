// ==UserScript==
// @name        [Pixlr] Unlimited Saves
// @namespace   HKR
// @match       https://pixlr.com/*/*
// @grant       none
// @version     1.1
// @author      HKR
// @description Bypasses the daily save limit
// @run-at      document-start
// ==/UserScript==

(() => {
    const replacementRegex = /\(\)\s*>=\s*3/g;
    const bypassStr = `()=='D'`;

    if (typeof InstallTrigger !== 'undefined') {
        // Firefox method
        function patchScript(event) {
            const script = event.target;
            const src = script?.src;

            if (src && src.includes('/dist/')) {
                event.preventDefault();

                fetch(src)
                    .then(res => res.text())
                    .then(text => {
                        text = text.replace(replacementRegex, bypassStr);

                        if (!text.includes(bypassStr)) {
                            alert(`Daily limit bypass failed, the userscript may be outdated!`);
                        }

                        const modifiedScript = document.createElement('script');
                        modifiedScript.innerHTML = text;

                        script.parentNode.replaceChild(modifiedScript, script);
                    });
            }
        }

        document.addEventListener('beforescriptexecute', patchScript, true);
    } else {
        // Chrome method
        function patchNode(node) {
            node?.remove();

            fetch(node.src)
                .then(res => res.text())
                .then(text => {
                    text = text.replace(replacementRegex, bypassStr);

                    if (!text.includes(bypassStr)) {
                        alert(`Daily limit bypass failed, the userscript may be outdated!`);
                    }

                    const newNode = document.createElement('script');
                    newNode.innerHTML = text;

                    document.body.appendChild(newNode);
                });
        }

        new MutationObserver(mutationsList => {
            mutationsList.forEach(mutationRecord => {
                [...mutationRecord.addedNodes]
                    .filter(node => node.tagName === 'SCRIPT' && node.src?.includes('/dist/'))
                    .forEach(node => patchNode(node));
            });
        }).observe(document, { childList: true, subtree: true });
    }
})();
