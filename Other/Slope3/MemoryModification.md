# WASM Memory Modification
### A demo of Cheat Engine type memory modification for userscripts targeting WASM applications.

## How to find WASM memory addresses

Use [Cetus](https://github.com/Qwokka/Cetus) to find the address(s) (aka. offset/index of the memory array).


## Find the offset without Cetus

Okay, so you're crazy or nerd enough to find the memory address/offset/index yourself without any tools, okay, okay. Here's my method,

```js
// ==UserScript==
// @name        Slope3 Memory Modification Demo Offset Finder
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

function hexToString(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        const charCode = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(charCode);
    }
    return str;
}

function printOffset(bufferBytes, offset) {
    const bytesPerRow = 3;
    const startIndex = Math.max(0, offset - bytesPerRow);
    const endIndex = Math.min(bufferBytes.length, offset + bytesPerRow + 1);

    const reducedBytes = bufferBytes.slice(startIndex, endIndex);

    const hexStr = reducedBytes.reduce((acc, value, index) => {
        const hexValue = value.toString(16).padStart(2, '0');

        acc += ` ${hexValue} `;

        return acc;
    }, '');

    console.log('Hex View:\n', hexStr, 'String View:\n', hexToString(hexStr));
}

function findSignaturesInArrayBuffer(buffer, signature) {
    const signatureBytes = signature.split(/([0-9A-Fa-f]{2}|\.)/).filter(Boolean).map(byte => {
        return (byte === '.') ? null : parseInt(byte, 16);
    });

    const bufferBytes = new Uint8Array(buffer);
    const matches = [];

    console.log('Attempting to find bytes', signatureBytes, 'from', bufferBytes);

    for (let i = 0; i < bufferBytes.length - signatureBytes.length + 1; i++) {
        let match = true;

        for (let j = 0; j < signatureBytes.length; j++) {
            if (signatureBytes[j] !== null && signatureBytes[j] !== bufferBytes[i + j]) {
                match = false;
                break;
            }
        }

        if (match) {
            matches.push(i);
        }
    }

    return matches.length ? matches : -1;
}

let offsets = null;

function intersectArrays(array1, array2) {
    const set2 = new Set(array2);
    const intersection = [];

    for (const value of array1) {
        if (set2.has(value)) {
            intersection.push(value);
        }
    }

    return intersection;
}

unsafeWindow.search = signature => {
    const offset = findSignaturesInArrayBuffer(memory.buffer, signature);

    if(offset !== -1) {
        if(offsets === null) {
            offsets = offset;
        } else {
            offsets = intersectArrays(offsets, offset);
        }

        console.warn(`Signature found at offset ${offsets}`);

        if(offsets.length <= 3) {
            const bufferBytes = new Uint8Array(memory.buffer);

            offsets.forEach(offset => printOffset(bufferBytes, offset));
            offsets.forEach(offset => bufferBytes.set([0x69], offset));
        }
    } else {
        console.log("Signature not found");
    }

    console.log(memory, memory.buffer);
}
```
## How to find out the offsets for the score

Before anything, install the above userscript and open up your developer tools console.

1) Start playing the game and reach score 1
2) To your developer console, input ```search('01')```
3) Keep playing the game and reach score 2
4) To your developer console, input ```search('02')```
5) [Keep playing and searching for the new score]
6) You should have only a few offsets remaining at some point
7) Figure out which offset is working by simply testing them

## Using the offset to modify the game

```js
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
```
