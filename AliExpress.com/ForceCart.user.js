// ==UserScript==
// @name         [AliExpress.com] Haka's Force "Add To Cart"
// @version      1.0
// @description  Reverse engineered patch for the script which has the "add to cart" logic
// @match        https://www.aliexpress.com/*
// @namespace    HKR
// @author       HKR
// @run-at       document-load
// ==/UserScript==

const obj = {
    bgColorEnd: "#FFFFFE",
    bgColorStart: "#FFFFFE",
    buttonType: "addToCart",
    enable: true,
    extraMap: { pdpCartParams: { sourceType: "" } },
    strokeColor: "#000000",
    textColor: "#000000",
    textContent: "Add to cart"
};

const scriptSrcIncludes = 'index.js';
const replacementRegex = /return\s+null\s*==\s*g\s*\|\|\s*!g\.addToCart/g;
const patchStr = `if(g && !('addToCart' in g)) g.addToCart = ${JSON.stringify(obj)}; return null == g || !g.addToCart`;

[...document.querySelectorAll('script')]
    .filter(s => s?.src?.includes('index.js'))
    .forEach(node => {
        node?.remove();

        fetch(node.src)
            .then(res => res.text())
            .then(text => {
                const foundMatch = replacementRegex.test(text);
                if(!foundMatch) return;

                text = text.replace(replacementRegex, patchStr);

                const newNode = document.createElement('script');
                      newNode.innerHTML = text;

                document.body.appendChild(newNode);
            });
    });
