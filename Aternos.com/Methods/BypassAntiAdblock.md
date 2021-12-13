## Methods to bypass the fullscreen anti-adblock warning

* *Note that they're probably all patched but should work with slight adjustments!*

* Some of the functions require JQuery!

---

#### OnBeforeScriptExecute

Check the requested script file, if contains the keyword, stop it from loading.

```js
/* onbeforescriptexecute - https://github.com/Ray-Adams/beforeScriptExecute-Polyfill */
const ChangeMe = Math.random().toString(36).substring(2, Math.floor(Math.random() * 40) + 5);

(() => {
    'use strict';

    if ('onbeforescriptexecute' in document) return;

    const BseEvent = new Event(ChangeMe, {
        bubbles: true,
        cancelable: true
    });

    const observerCallback = (mutationsList) => {
        for (let mutationRecord of mutationsList) {
            for (let node of mutationRecord.addedNodes) {
                if (node.tagName !== 'SCRIPT') continue;

                // Adds functionality to document.onbeforescriptexecute
                if (typeof document.ChangeMe === 'function') {
                    document.addEventListener(
                        ChangeMe,
                        document.ChangeMe,
                        { once: true }
                    );
                };

                // Returns false if preventDefault() was called
                if (!node.dispatchEvent(BseEvent)) {
                    node.remove();
                };
            };
        };
    };

    const AlsoChangeMe = new MutationObserver(observerCallback);
    AlsoChangeMe.observe(document, { childList: true, subtree: true });
})();

//A new web request initiated
document.ChangeMe = (e) => {
  console.log(e.target.src)
    //If it requests a selected file
    if (e.target.src.includes('keyword')) {
        //Block it
        e.preventDefault();
}
```

---
