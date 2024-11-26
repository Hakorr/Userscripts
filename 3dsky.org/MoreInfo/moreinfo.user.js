// ==UserScript==
// @name        3dsky.org Display More Info
// @namespace   HKR
// @match       https://3dsky.org/3dmodels*
// @grant       none
// @version     1.0
// @author      HKR
// @description Display more information on the catalog page
// @run-at      document-start
// ==/UserScript==

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const interval = 100;
        const endTime = Date.now() + timeout;

        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkExist);
                resolve(element);
            } else if (Date.now() > endTime) {
                clearInterval(checkExist);
                reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms.`));
            }
        }, interval);
    });
}

function applyDataToItems(modelsArr) {
    modelsArr.forEach(async model => {
        const slug = model.slug;
        const properties = model.properties;

        const itemElem = await waitForElement(`a[href*="3dmodels/show/${slug}"]`);
        const itemContentElem = itemElem.parentElement.parentElement;

        const sizeDisplay = properties?.size_kb
            ? `<div style='font-size: 1.2em; font-weight: bold; margin-bottom: 4px;'>${(properties.size_kb / 1000) | 0} MB</div>`
            : '';

        const dimensions = (properties?.width || properties?.height || properties?.length)
            ? `<div>${properties?.width | 0} x ${properties?.height | 0} x ${properties?.length | 0}</div>`
            : '';

        const customElem = document.createElement('div');
              customElem.innerHTML = sizeDisplay + dimensions;
              customElem.style.cssText = `
                  display: flex;
                  gap: 10px;
                  align-items: center;
                  border-top: 1px solid #0000002e;
                  margin-top: 5px;
                  padding-top: 5px;
              `;

        itemContentElem.appendChild(customElem);
    });
}

const originalXHROpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (url.includes('https://3dsky.org/api/models')) {
        console.log('Intercepted XMLHttpRequest to:', url);

        this.addEventListener('load', function () {
            try {
                const responseData = JSON.parse(this.responseText);
                const models = responseData?.data?.models;
                applyDataToItems(models);
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
            }
        });
    }

    return originalXHROpen.call(this, method, url, ...rest);
};
