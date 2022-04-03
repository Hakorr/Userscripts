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
 * Regular zoom value: 1
 * Smaller the number, the more you can zoom outwards
 * It's recommended to set it back to 1 when you don't need the extra zoom
 * */
const ZOOM_LEVEL = 0.75;

const CALC_INVERSE_ZOOM = 1.5 - Math.log(ZOOM_LEVEL);
const TOOLTIP_ZOOM_LEVEL = CALC_INVERSE_ZOOM <= 0.5
    ? 1
    : CALC_INVERSE_ZOOM;

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
    const container02 = container01.querySelector("mona-lisa-camera").shadowRoot;
    const container03 = container01.querySelector("mona-lisa-camera");

    const pixel = container02.querySelector(".pixel");
    const tooltip = pixel.querySelector("mona-lisa-tooltip");
  
    tooltip.setAttribute("style", `
        zoom: ${TOOLTIP_ZOOM_LEVEL}
    `);
  
    container03.setAttribute("style", `
        zoom: ${ZOOM_LEVEL}
    `);
};
