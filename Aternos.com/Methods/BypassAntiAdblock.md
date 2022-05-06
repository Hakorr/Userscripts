## Methods to bypass the fullscreen anti-adblock warning

* *Note that they're probably all patched but should work with slight adjustments!*

* Some of the functions might require JQuery!

---

#### OnBeforeScriptExecute

Check the requested script file, if contains the keyword, stop it from loading.

```js
// @run-at      document-start

(() => {
    'use strict';

    const observerCallback = (mutationsList) => {
        for (let mutationRecord of mutationsList) {
            for (let node of mutationRecord.addedNodes) {
                if (node.tagName !== 'SCRIPT') continue;

                 /* Example keywords: 
                 - 'data:text/javascript;base64
                 - 'base64'
                 - 'jquery' */

                if (node.src.includes('data:text/javascript;base64') 
                    || node.outerHTML.includes('data:text/javascript;base64') 
                    || node.innerHTML.includes('data:text/javascript;base64')) {
                    // Remove the element
                    node.remove();
                }
            };
        };
    };

    const mutObvsr = new MutationObserver(observerCallback);
    mutObvsr.observe(document, { childList: true, subtree: true });
})();
```

---

#### Remove a script element that contains Base64

```js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @run-at      document-start

document.arrive('[src*="data:text/javascript;base64"]', function () { 
    let scriptElem = document.querySelector('script[src*="data:text/javascript;base64"]');
    if(scriptElem) scriptElem.remove();
});
```

---

#### Make the AntiAdblock script malfunction, causing it not fully running

```js
// @run-at      document-start

window.Date.now = 0;
```

---
