// ==UserScript==
// @name        [Reddit r/Place] ExtraZoom
// @namespace   HKR
// @match       https://hot-potato.reddit.com/embed
// @grant       none
// @version     1.0
// @author      HKR
// @description Allows you to zoom a bit further
// @run-at      document-load
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

/* ZOOM_LEVEL
 * Default: 1
 * Smaller the number, the more you can zoom outwards
 * It's recommended to set it back to 1 when you don't need the extra zoom
 * */
const ZOOM_LEVEL = 0.5;

const app = document.querySelector("mona-lisa-app");

if(typeof app != "null") {
    let waitForElement = setInterval(() => {
        let container = document.querySelector("mona-lisa-embed").shadowRoot;

        if(container) {
            start();
            clearInterval(waitForElement);
        }
    }, 50);
}

const start = () => { // start script when iframe loaded properly
    const container01 = document.querySelector("mona-lisa-embed").shadowRoot;
    const container02 = container01.querySelector("mona-lisa-camera");

    container02.setAttribute("style", `
        zoom: ${ZOOM_LEVEL}
    `);
};