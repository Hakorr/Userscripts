## Methods to bypass the fullscreen anti-adblock warning

* *Note that they're probably all patched but should work with slight adjustments!*

* Some of the functions might require JQuery!

---

#### OnBeforeScriptExecute

Check the requested script file, if contains the keyword, stop it from loading.

```js
// @run-at      document-start

/* onbeforescriptexecute - https://github.com/Ray-Adams/beforeScriptExecute-Polyfill */
const ChangeMe = Math.random().toString(36).substring(2, Math.floor(Math.random() * 40) + 5);

(() => {
    'use strict';

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

    const mutObvsr = new MutationObserver(observerCallback);
    mutObvsr.observe(document, { childList: true, subtree: true });
})();

//A new web request initiated
document.ChangeMe = (e) => {
    /* Example keywords: 
     - 'data:text/javascript;base64
     - 'base64'
     - 'jquery' */
  
    if (e.target.src.includes('data:text/javascript;base64') 
        || e.target.outerHTML.includes('data:text/javascript;base64') 
        || e.target.innerHTML.includes('data:text/javascript;base64')) {
        //Block it
        e.preventDefault();
    }
}
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

#### Remove the second script element which contains malicious code

```js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @run-at      document-start

document.arrive("script", function () { 
    document.querySelectorAll("script")[1].remove();
});
```

---
