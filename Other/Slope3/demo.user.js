// ==UserScript==
// @name        Slope3 Memory Modification Demo
// @namespace   HKR
// @match       https://ubg44.github.io/Slope3/
// @grant       none
// @version     1.0
// @author      HKR
// @run-at      document-load
// @description Memory Modification Demo
// @grant       unsafeWindow
// ==/UserScript==

let memory = null;

const originalWebAssemblyMemory = WebAssembly.Memory;

const webAssemblyMemoryProxy = new Proxy(originalWebAssemblyMemory, {
    construct: function (target, args) {
        const memoryInstance = new target(...args);

        memory = memoryInstance;

        return memoryInstance;
    },
});

WebAssembly.Memory = webAssemblyMemoryProxy;

const waitForScoreInterval = setInterval(() => {
    const bufferBytes = new Uint8Array(memory.buffer);

    const scoreOffset = 18132320;

    if(bufferBytes[scoreOffset] === 1) {
        clearInterval(waitForScoreInterval);

        bufferBytes.set([0x1F2], scoreOffset);
    }
}, 500);
