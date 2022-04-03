// ==UserScript==
// @name        [Reddit r/Place] ExtraUserInformation
// @namespace   HKR
// @match       https://www.reddit.com/r/place/*
// @match       https://hot-potato.reddit.com/embed
// @grant       none
// @version     1.0
// @author      HKR
// @description Adds additional info about the user to the usertag
// @run-at      document-load
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

const fixnumber = number => number < 10 ? "0" + number : number;

const unixToDate = UNIX_timestamp => {
    const d = new Date(UNIX_timestamp * 1000);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    let year = d.getFullYear(),
    monthNum = d.getMonth() + 1,
    month = months[d.getMonth()],
    date = d.getDate(),
    hour = fixnumber(d.getHours()),
    min = fixnumber(d.getMinutes()),
    sec = fixnumber(d.getSeconds());

    return `${date}.${monthNum}.${year}`; // (DD/MM/YY)
};

if (window.top === window.self) {
    window.addEventListener("message", async event => {
        if(typeof event.data.user == "string") {
            const response = await fetch(`https://www.reddit.com/user/${event.data.user}/about.json`);
            const data = await response.json();

            GM_setValue("USER_DATA", data);
        }
    }, false);
} else {
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

        let lastUsername = "";  

        setInterval(async () => { // loop to detect new usernames
            const pixel = container02.querySelector(".pixel");
            const pixelBtn = pixel.querySelector(".profile-button");
            const username = pixelBtn.innerText.replaceAll("u/","");

            if(!username.includes("\n") && username != lastUsername) { // continue if username is new
                lastUsername = username;

                // send a request to the top window to send a fetch request to get user data
                window.top.postMessage({
                    user: username
                }, "*");
              
                let userData = null;
              
                let waitForValue = setInterval(() => { // loop to wait for fetched data
                    const data = GM_getValue("USER_DATA");
                    
                    if(typeof data == "object") { // if data received
                        userData = data;
                        GM_setValue("USER_DATA", "");
                      
                        clearInterval(waitForValue);
                      
                        pixelBtn.setAttribute("style", `
                            font-family: var(--mona-lisa-font-sans);
                            font-weight: 700;
                            background: rgb(75, 0, 255);
                            color: rgb(255 255 255);
                            border: 0px;
                            outline: 0px;
                            font-size: 14px;
                            padding: 5px 16px;
                            cursor: pointer;
                            pointer-events: all;
                            position: absolute;
                            transform: translateY(-80%);
                            border-radius: 100px;
                            box-shadow: 0px 2px 10px #00000085;
                        `);
                      
                        const extraInfo = `Karma: ${userData.data.total_karma}`
                        + ` | Verified: ${userData.data.verified == true ? "Yes": "No"}`
                        + ` | Admin: ${userData.data.is_employee == true ? "Yes": "No"}`
                        + ` | Created: ${unixToDate(userData.data.created)}`
                        + ` | <a href="https://www.reddit.com/user/${username}" target="_blank" rel="noopener noreferrer">Profile</a>`
                        + ` | <a href="https://www.reddit.com/message/compose/?to=${username}&subject=About%20your%20pixel%20placement%20on%20r%2Fplace..." target="_blank" rel="noopener noreferrer">Message</a>`;
                      
                        const userDetails = document.createElement('button');
                        userDetails.classList.add("profile-button-extra-info-section");
                        userDetails.style = `
                            font-family: var(--mona-lisa-font-sans);
                            font-weight: 700;
                            background: none;
                            color: rgb(75 0 255);
                            border: 0px;
                            outline: 0px;
                            font-size: 14px;
                            padding: 5px 16px;
                            cursor: pointer;
                            pointer-events: all;`;
                        userDetails.innerHTML = extraInfo;
                      
                        [...pixelBtn.parentElement.querySelectorAll(".profile-button-extra-info-section")].forEach(x => {
                            x.remove();
                        });
                      
                        pixelBtn.parentElement.appendChild(userDetails);
                    }
                }, 100);
            }
        }, 100);
    };
}
