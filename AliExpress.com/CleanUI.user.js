// ==UserScript==
// @name         [AliExpress.com] Haka's Clean UI | Remove JUNK!
// @version      1.1
// @description  Reorder the listing page layout to make more sense.
// @match        https://www.aliexpress.com/*
// @grant        GM_addStyle
// @namespace    HKR
// @author       HKR
// @run-at       document-load
// ==/UserScript==
 
// Motive:
// - AliExpress' UI is clunky, I probably wasted hours just scrolling a product page to find its information.
// - Sellers try to trick you with a 'fake' picture connected to the listing/description. Don't trust images, always check what is written, this helps you with that.
// Features:
// - Display correct initial picture and not the thumbnail, so that the price is correct.
// - Prefer text on product description, push images below.
// - Push additional product listings to the bottom of the page.
// - Product description and reviews splitscreen.
// - Resize unimportant things to become smaller.
 
const alreadyRan = document.querySelector('.user-panel-container') ? true : false;
if(alreadyRan) return;
 
const classesToManipulate = [
    'store-info',
    'review--wrap',
    'specification--wrap',
    'description--wrap',
    'detailmodule_dynamic',
    'sku-item--skus--',
    'data-spm="pcDetailTopMoreOtherSeller"'
];
 
const processedClasses = [];
 
let userLeftPanel = null;
let userRightPanel = null;
let hasAddedUserPanel = false;
 
function addUserPanel(containerElem) {
    if(containerElem) {
        const infoElem = document.querySelector('.pdp-info');
 
        if(infoElem) {
            const panelContainer = document.createElement('div');
            panelContainer.className = 'user-panel-container';
 
            userLeftPanel = document.createElement('div');
            userLeftPanel.className = 'userscript-left-panel';
 
            userRightPanel = document.createElement('div');
            userRightPanel.className = 'userscript-right-panel';
 
            panelContainer.appendChild(userLeftPanel);
            panelContainer.appendChild(userRightPanel);
 
            infoElem.insertAdjacentElement('afterend', panelContainer);
 
            hasAddedUserPanel = true;
        }
    }
}
 
const processingInterval = setInterval(() => {
    const containerElem = document.querySelector('.pdp-body-top-left');
 
    if(!hasAddedUserPanel) addUserPanel(containerElem);
 
    classesToManipulate.forEach(elemClass => {
        const alreadyProcessed = processedClasses.includes(elemClass);
        if(alreadyProcessed) return;
 
        const elem = elemClass.includes('=')
            ? document.querySelector(`[${elemClass}]`)
            : document.querySelector(`[class*="${elemClass}"]`);
 
        if(!elem) return;
 
        switch(elemClass) {
            case 'store-info':
                containerElem.prepend(elem);
                break;
            case 'data-spm="pcDetailTopMoreOtherSeller"':
                containerElem.appendChild(elem.parentElement.parentElement);
                break;
            case 'review--wrap':
                userRightPanel.appendChild(elem);
                break;
            case 'specification--wrap':
                userLeftPanel.appendChild(elem);
                break;
            case 'description--wrap':
                userLeftPanel.appendChild(elem);
                break;
            case 'detailmodule_dynamic':
                const productDescription = document.querySelector('#product-description');
 
                const isChild = productDescription.contains(elem);
                if(!isChild) return;
 
                productDescription.appendChild(elem);
 
                break;
            case 'sku-item--skus--':
                [...elem.childNodes]?.[0]?.click();
                break;
        }
 
        processedClasses.push(elemClass);
 
        console.log(processedClasses.length, classesToManipulate.length, processedClasses.length >= classesToManipulate.length);
 
        if(processedClasses.length >= classesToManipulate.length)
            clearInterval(processingInterval);
    });
}, 1000);
 
GM_addStyle(`
.user-panel-container {
    display: flex;
    gap: 50px;
    margin-top: 50px;
    padding: 10px;
}
.userscript-left-panel {
    min-width: 50%;
}
.pdp-page-wrap .pdp-body-top-left {
    width: 85%;
}
.pdp-page-wrap .pdp-body-top-right {
    width: 15%;
}
.description--product-description--Mjtql28 img {
    max-width: 40% !important;
}
.description--product-description--Mjtql28 img:hover {
    max-width: 60% !important;
}
`);
