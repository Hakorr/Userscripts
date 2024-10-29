// ==UserScript==
// @name        Väinämöinen v1
// @namespace   Haka
// @match       https://web.telegram.org/a/*
// @grant       none
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      Haka
// @description A simple Telegram bot for semi-automated advertising
// @require     https://github.com/AugmentedWeb/UserGUI/raw/Release-1.0/usergui.js
// ==/UserScript==

const GUI = new UserGui;

let startURL = '';
let running = false;

GUI.settings.window.title = "Väinämöinen v1 ALPHA";
GUI.settings.window.centered = true;
GUI.settings.gui.internal.darkCloseButton = true;

GUI.addPage('Main', `
<div class="rendered-form">
<div id="vainamoinen-status" style="
        font-size: 17px;
        color: black;
        font-weight: 100;
        margin-bottom: 10px;
        border: 1px solid #0000002e;
        padding: 10px;
        background-color: #00000014;
        border-radius: 5px;
    ">Standby</div>
    <div class="formbuilder-textarea form-group field-textarea-1730084344875">
        <label for="textarea-1730084344875" class="formbuilder-textarea-label">Message to type</label>
        <textarea type="textarea" placeholder="Hello! I am contacting you about... Thanks!" class="form-control" name="textarea-1730084344875" access="false" id="textarea-1730084344875"></textarea>
    </div>
    <div style="
        display: flex;
        justify-content: space-between;
    ">
        <div class="formbuilder-button form-group field-button-1730084393207">
            <button type="button" class="btn-primary btn" name="button-1730084393207" access="false" style="primary" id="button-1730084393207">Start</button>
        </div>
        <div id="dm-action-container" style="display: none;">
            <div class="formbuilder-button form-group field-button-1730087756422">
                <button type="button" class="btn-success btn" name="button-1730087756422" access="false" style="success" id="button-1730087756422">Send</button>
            </div>
            <div class="formbuilder-button form-group field-button-1730087772460">
                <button type="button" class="btn-warning btn" name="button-1730087772460" access="false" style="warning" id="button-1730087772460">Skip</button>
            </div>
      </div>
    </div>
</div>
`);

GUI.addPage('Debug', `
<div class="rendered-form">
    <div class="">
        <h4 access="false" id="control-1301107">Navigation</h4></div>
    <div class="formbuilder-button form-group field-button-1730085173551">
        <button type="button" class="btn-primary btn" name="button-1730085173551" access="false" style="primary" id="button-1730085173551">Open Group Info</button>
    </div>
    <div class="formbuilder-button form-group field-button-1730089961453">
        <button type="button" class="btn-primary btn" name="button-1730089961453" access="false" style="primary" id="button-1730089961453">Go back</button>
    </div>
    <div class="">
        <h4 access="false" id="control-3494137">Data Collection</h4></div>
    <div class="formbuilder-button form-group field-button-1730087344140">
        <button type="button" class="btn-danger btn" name="button-1730087344140" access="false" style="danger" id="button-1730087344140">Clear Data</button>
    </div>
    <div class="">
        <h4 access="false" id="control-9085156">Messaging</h4></div>
    <div class="formbuilder-textarea form-group field-textarea-1730083665073">
        <label for="textarea-1730083665073" class="formbuilder-textarea-label">Message</label>
        <textarea type="textarea" placeholder="Väinämöinen on siisti!" class="form-control" name="textarea-1730083665073" access="false" id="textarea-1730083665073"></textarea>
    </div>
    <div class="formbuilder-button form-group field-button-1730084036467">
        <button type="button" class="btn-primary btn" name="button-1730084036467" access="false" style="primary" id="button-1730084036467">Type</button>
    </div>
    <div class="formbuilder-button form-group field-button-1730083661362">
        <button type="button" class="btn-primary btn" name="button-1730083661362" access="false" style="primary" id="button-1730083661362">Send</button>
    </div>
</div>
`);

GUI.addPage('Info', `
<div class="rendered-form">
    <h4>Väinämöinen is a Telegram semi-automatic group mass DM sender.</h4>
    <small><b>We are not responsible for any issues such as damages or losses caused by the userscript.</b></small><br><br>
    <h5>Usage</h5>
    <p>1. Open a group chat with a member list visible.</p>
    <p>2. Write your message to the floating Väinämöinen window.</p>
    <p>3. Start, then choose to send (ENTER) or to skip (SPACEBAR) the message.</p>
    <small><b>NOTE: Do not navigate the Telegram site yourself during this process. Do not spam keybinds or buttons.</b></small><br><br>
    <h5>Additional</h5>
    <p access="false" id="control-6533252">Read more here! <a href="https://github.com/Hakorr/Userscripts">https://github.com/Hakorr/Userscripts</a></p>
</div>
`);

GUI.open(() => {
    GUI.loadConfig();
    startURL = document.URL;

    GUI.smartEvent('button-1730084036467', () => {
        typeMessage(GUI.getValue('textarea-1730083665073'));
    });

    GUI.smartEvent('button-1730083661362', () => {
        sendMessage();
    });

    GUI.smartEvent('button-1730085173551', () => {
        openGroupInfo();
    });

    GUI.smartEvent('button-1730087344140', () => {
        clearData();
    });

    GUI.smartEvent('button-1730089961453', () => {
        navigateBack();
    });

    // Main start button
    GUI.smartEvent('button-1730084393207', e => {
        const startBtn = e.target;
        const statusElem = GUI.document.querySelector('#vainamoinen-status');
        const text = GUI.document.querySelector('#textarea-1730084344875').value;

        GUI.saveConfig();

        if(!text) {
            running = false;

            startBtn.innerText = 'Start';
            statusElem.innerText = 'Standby';

            alert('No message set! Please write a message to the textarea.');

            return;
        }

        running = !running;

        // Started
        if(running) {
            startBtn.innerText = 'Stop';

            startURL = document.URL;

            start(text, statusElem);
        }
        // Stopped
        else {
            startBtn.innerText = 'Start';

            statusElem.innerText = 'Standby';
        }
    });

    // Confirm Message Send
    GUI.smartEvent('button-1730087756422', async () => {
        const statusElem = GUI.document.querySelector('#vainamoinen-status');
        const text = GUI.document.querySelector('#textarea-1730084344875').value;

        if(startURL !== document.URL) {
            statusElem.innerText = 'Sending the message...';

            typeMessage(text);

            await sleep(25);

            sendMessage();

            await sleep(25);

            navigateBack();
        } else {
            statusElem.innerText = 'URL mismatch, did not send message';

            navigateBack();
        }

    });

    GUI.document.addEventListener("keydown", processKeyPress);
    document.addEventListener("keydown", processKeyPress);

    // Confirm Message Skip
    GUI.smartEvent('button-1730087772460', () => {
        const statusElem = GUI.document.querySelector('#vainamoinen-status');

        statusElem.innerText = 'Not sending the message, user skipped this member';

        navigateBack();
    });

});

function processKeyPress(e) {
    const dmActionContainer = GUI.document.querySelector('#dm-action-container');

    if(running && dmActionContainer.style.display !== 'none') {
        if(e.key === 'Enter') {
            e.preventDefault();

            const sendBtn = GUI.document.querySelector('button[name=button-1730087756422]');

            sendBtn.click();
        } else if(e.key === ' ' || event.key === 'Spacebar') {
            e.preventDefault();

            const skipBtn = GUI.document.querySelector('button[name=button-1730087772460]');

            skipBtn.click();
        }
    }
}

async function start(text, statusElem) {
    const dmActionContainer = GUI.document.querySelector('#dm-action-container');

    startURL = document.URL;

    statusElem.innerText = 'Opening group info...';

    openGroupInfo();

    await sleep(250);

    for(let i = 0; i < 100000; i++) {
        if(!running) return;

        statusElem.innerText = 'Processing member number: ' + (i + 1);

        // Select the target element
        const targetElement = await waitForElement('.Profile.custom-scroll');
        const membersList = await waitForElement('.content.members-list');

        const memberObj = await getMemberByIndex(targetElement, membersList, i);

        if(!memberObj) {
            statusElem.innerText = 'No more members found!';

            break;
        }

        const existingMemberObjArr = GM_getValue('memberObjArr') || [];
        const alreadyExists = existingMemberObjArr.find(obj => obj.id === memberObj.id);

        if(alreadyExists) {
            statusElem.innerText = 'Skipping user, it has already been processed!';

            continue;
        } else {
            existingMemberObjArr.push(memberObj);
            GM_setValue('memberObjArr', existingMemberObjArr);
        }

        statusElem.innerText = 'Navigating to DMs of ' + memberObj.fullName;

        // Click the user profile to navigate to the DMs
        clickElement(memberObj.elem);

        // Wait for the DM to load
        await waitForDMChange();
        await sleep(50);

        statusElem.innerText = 'Waiting for your decision...';

        dmActionContainer.style.display = 'revert';

        await waitForGroupChange();

        dmActionContainer.style.display = 'none';

        statusElem.innerText = 'Done with ' + memberObj.fullName;
    }
}

async function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);

        // If the element is already in the DOM, resolve immediately
        if (element) {
            return resolve(element);
        }

        // Set up a timeout to reject the promise if the element isn't found in time
        const timeoutId = setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
        }, timeout);

        // Use a MutationObserver to detect changes in the DOM
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearTimeout(timeoutId); // Clear the timeout
                observer.disconnect();    // Stop observing
                resolve(el);              // Resolve the promise with the element
            }
        });

        // Start observing the DOM for changes
        observer.observe(document.body, { childList: true, subtree: true });
    });
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function waitForDMChange() {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
            if (document.URL !== startURL) {
                observer.disconnect(); // Stop observing once the condition is met
                resolve(true);
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    });
}

async function waitForGroupChange() {
    return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            if (document.URL === startURL) {
                observer.disconnect();
                resolve(true);
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    });
}


function clearData(skipConfirm) {
    if(confirm('Are you sure? This might lead to you sending a message to the same person multiple times.') || skipConfirm) {
        GM_setValue('memberObjArr', []);
    }
}

function scrollGroupInfo(indexToFind) {
    // Select the target element
    const targetElement = document.querySelector('.Profile.custom-scroll');

    if (targetElement) {
        // Function to scroll the element and trigger the scroll event
        function triggerInfiniteScroll() {
            // Scroll the element down by a specific amount (e.g., 100 pixels)
            targetElement.scrollTop += 15;

            // Dispatch the scroll event to simulate user scrolling
            const scrollEvent = new Event('scroll', { bubbles: true, cancelable: true });
            targetElement.dispatchEvent(scrollEvent);
        }

        // Continuously scroll until new elements load
        const intervalId = setInterval(() => {
            triggerInfiniteScroll();
        }, 5); // Scroll every 500ms (adjust as needed)
    } else {
        console.log("Target element not found.");
    }
}

function getRenderedMembers(existingMemberList) {
    const memberListItemArr = [...document.querySelectorAll('.content.members-list .ListItem')];

    for(const elem of memberListItemArr) {
        const fullName = elem.querySelector('.fullName').innerText;
        const id = elem.querySelector('*[data-peer-id]').dataset.peerId;
        const memberObj = { fullName, id, 'elem': elem.querySelector('.contact-list-item .ChatInfo') };

        const alreadyExists = existingMemberList.find(obj => obj.id === id);

        if(!alreadyExists) {
            existingMemberList.push(memberObj);
        }
    }

    return existingMemberList;
}

async function getMemberByIndex(targetElement, membersList, indexToFind) {
    indexToFind = Math.max(indexToFind, 0);

    let memberArr = [];

    if (targetElement) {
        // Function to scroll the element and trigger the scroll event
        function triggerInfiniteScroll() {
            // Scroll the element down by a specific amount (e.g., 100 pixels)
            targetElement.scrollTop += 100;

            // Dispatch the scroll event to simulate user scrolling
            const scrollEvent = new Event('scroll', { bubbles: true, cancelable: true });
            targetElement.dispatchEvent(scrollEvent);

            memberArr = getRenderedMembers(memberArr);
        }

        return new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                triggerInfiniteScroll();

                console.log(membersList.childElementCount, memberArr.length, indexToFind);

                // If the desired index is reached, resolve the promise with the member
                if (memberArr.length >= indexToFind) {
                    clearInterval(intervalId);
                    resolve(memberArr[indexToFind]);
                }
            }, 50); // Scroll every 50ms (adjust as needed)
        });
    } else {
        console.log("Target element not found.");
        throw new Error("Target element not found.");
    }
}

function clickElement(elem) {
    if(elem) {
        const mouseDownEvent = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
        });

        const mouseUpEvent = new MouseEvent("mouseup", {
            bubbles: true,
            cancelable: true,
        });

        elem.dispatchEvent(mouseDownEvent);
        elem.dispatchEvent(mouseUpEvent);
    } else {
        console.warn('NO ELEMENT FOUND, CANNOT CLICK IT!');
    }
}

function navigateBack() {
    const chatInfoElem = document.querySelector('button[title="Back"]');

    clickElement(chatInfoElem);
}

function openGroupInfo() {
    const chatInfoElem = document.querySelector('.chat-info-wrapper');

    clickElement(chatInfoElem);
}

function typeMessage(msg) {
    const inputField = [...document.querySelectorAll('#editable-message-text')].pop();
    const isPageStartURL = startURL === document.URL;

    if(inputField && !isPageStartURL) {
        inputField.innerText = msg;
        inputField.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
        console.warn('INPUT FIELD WAS NOT FOUND OR URL IS START URL!');
    }
}

function sendMessage() {
    const sendButton = document.querySelector('button.send.main-button');
    const isPageStartURL = startURL === document.URL;

    if(sendButton && !isPageStartURL) {
        sendButton.click();
    } else {
        console.warn('SEND BUTTON WAS NOT FOUND!');
    }
}
