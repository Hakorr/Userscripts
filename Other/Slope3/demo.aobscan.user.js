// ==UserScript==
// @name        Slope3 Memory Modification Demo Aob Scan
// @namespace   HKR
// @match       https://ubg44.github.io/Slope3/
// @grant       none
// @version     1.0
// @author      HKR
// @run-at      document-load
// @description Memory Modification Demo
// @grant       unsafeWindow
// ==/UserScript==

// THIS IS A DEMO AND DOESN'T CONTAIN THE ACTUAL SCORE SIGNATURE

unsafeWindow.memory = null;

let scoreAddress = 0;
const scoreSignature = 'ffffffff0a0000000200000000000000020000001400000000000000000000000000000002';
const scoreOffset = 20;

const originalWebAssemblyMemory = WebAssembly.Memory;

const webAssemblyMemoryProxy = new Proxy(originalWebAssemblyMemory, {
    construct: function (target, args) {
        const memoryInstance = new target(...args);

        memory = memoryInstance;

        return memoryInstance;
    },
});

WebAssembly.Memory = webAssemblyMemoryProxy;

async function findSignaturesInArrayBuffer(buffer, signature) {
    return new Promise((resolve, reject) => {
        const workerCode = `
            self.onmessage = function (event) {
                const { buffer, signature } = event.data;

                function findSignaturesInArrayBuffer(buffer, signature) {
                    const signatureBytes = signature.split(/([0-9A-Fa-f]{2}|\.)/).filter(Boolean).map(byte => {
                        return (byte === '.') ? null : parseInt(byte, 16);
                    });

                    const bufferBytes = new Uint8Array(buffer);
                    const matches = [];

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

                    self.postMessage({ matches });
                }

                findSignaturesInArrayBuffer(buffer, signature);
            };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);

        worker.onmessage = function (event) {
            const { matches } = event.data;
            resolve(matches.length ? matches : -1);
            worker.terminate();
        };

        worker.onerror = function (error) {
            reject(error);
            worker.terminate();
        };

        worker.postMessage({ buffer, signature });
    });
}

setInterval(async () => {
    if(!memory?.buffer) return;

    const bufferBytes = new Uint8Array(memory.buffer);

    const searchResults = await findSignaturesInArrayBuffer(bufferBytes, scoreSignature); // perform aob scan

    if(searchResults !== -1) {
        scoreAddress = searchResults[0] + scoreOffset;
    }

    const score = bufferBytes[scoreAddress];

    console.warn(`The score is ${score.toString(16)} with address ${scoreAddress}`);
}, 1000);
