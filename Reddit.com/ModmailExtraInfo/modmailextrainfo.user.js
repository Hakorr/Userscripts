// ==UserScript==
// @name        [Reddit] Modmail++
// @namespace   HKR
// @match       https://mod.reddit.com/mail/*
// @grant       none
// @version     3.5
// @author      HKR
// @description Additional tools and information to Reddit's Modmail
// @icon        https://www.redditstatic.com/modmail/favicon/favicon-32x32.png
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// @require     https://cdn.jsdelivr.net/npm/party-js@2.1.2/bundle/party.js#sha256-J9/UDCn536lyy03NDKIUT6WX3DU9FqZZ9ydg++UVUC0=
// ==/UserScript==

(() => {
console.log("[Modmail++] %cScript started!", "color: green");

class __settings__ {
    subTag = $(".ThreadTitle__community")?.href?.slice(23) || "r/subreddit"; //Format r/subreddit
    userTag = "u/" + $(".InfoBar__username")?.innerText || "u/username"; //Format u/username
    modmail = `[modmail](https://www.reddit.com/message/compose?to=/${keepPrefix(this.subTag, true)})`;
    rules = `https://www.reddit.com/${keepPrefix(this.subTag, true)}/about/rules`;
  
    /* Responses - Edit to your own liking, remove whatever you don't like!
    - name | The name of the response that will show on the listbox. (Example value: "Hello!")
    - replace | Replace all messagebox text if true, otherwise just add. (Example value: true)
    - subreddit | Visible only while on this subreddit's modmail. (Example value: "r/subreddit")
    - content | This text will be added to the messagebox once selected (Example value: "Hello world!")*/
    responses = [
        {
            "name":"Default Approved",
            "replace":true,
            "subreddit":"",
            "content":`Hey, approved the post!`
        },
        {
            "name":"Default Rule Broken",
            "replace":true,
            "subreddit":"",
            "content":`Your post broke our [rules](${this.rules}).\n\nThe action will not be reverted.`
        },
        {
            "name":"Add Rule Description",
            "replace":false,
            "subreddit":"",
            "content":`<open-rulelist-dialog>`
        },
        {
            "name":"Add Greetings",
            "replace":false,
            "subreddit":"",
            "content":`${randItem(["Greetings","Hello","Hi"])} ${this.userTag},\n\n`
        },
        {
            "name":"Add Subreddit Mention",
            "replace":false,
            "subreddit":"",
            "content":`${this.subTag}`
        },
        {
            "name":"Add User Mention",
            "replace":false,
            "subreddit":"",
            "content":`${this.userTag}`
        },
        {
            "name":"Add Modmail Link",
            "replace":false,
            "subreddit":"",
            "content":`${this.modmail}`
        },
        {
            "name":"Add Karma Link",
            "replace":false,
            "subreddit":"",
            "content":`[karma](https://reddit.zendesk.com/hc/en-us/articles/204511829-What-is-karma-)`
        },
        {
            "name":"Add Shadowban Link",
            "replace":false,
            "subreddit":"",
            "content":`[shadowbanned](https://www.reddit.com/r/ShadowBan/comments/8a2gpk/an_unofficial_guide_on_how_to_avoid_being/)`
        },
        {
            "name":"Add Content Policy",
            "replace":false,
            "subreddit":"",
            "content":`[Content Policy](https://www.redditinc.com/policies/content-policy)`
        },
        {
            "name":"Add User Agreement",
            "replace":false,
            "subreddit":"",
            "content":`[User Agreement](https://www.redditinc.com/policies/user-agreement)`
        },
            {
            "name":"Add Reddiquette",
            "replace":false,
            "subreddit":"",
            "content":`[Reddiquette](https://reddit.zendesk.com/hc/en-us/articles/205926439-Reddiquette)`
        },
            {
            "name":"Add Admin Modmail",
            "replace":false,
            "subreddit":"",
            "content":`[Admins](https://www.reddit.com/message/compose?to=%2Fr%2Freddit.com)`
        },
        {
            "name":"Add Rickroll",
            "replace":false,
            "subreddit":"",
            "content":`[link](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`
        },
        {
            "name":"Invitation (New Message)",
            "replace":true,
            "subreddit":"",
            "subject": `Invitation to become a moderator of ${this.subTag}`,
            "content":`${randItem(["Greetings","Hello","Hi"])} ${this.userTag},\n\nWould you like to moderate ${this.subTag} with us? Please let us know as soon as possible!`
        }
    ];

    themeMode = $$(".theme-dark").length ? true : false;
    textColor = this.themeMode ? "#757575" : "#6e6e6e"; // dark hex : light hex
    titleColor = this.themeMode ? "#a7a7a7" : "#2c2c2c"; // dark hex : light hex
    listBoxColor = this.themeMode ? "#242424" : "#f1f3f5"; // dark hex : light hex

    dataColor = "#0079d3"; // data (numbers etc.) color

    enableCustomResponses = true; // if to append the custom response box

    chatProfileIcons = true; // if to append chat profile icons

    placeholderMessage = randItem([
        "Message...",
        "Look, a bird! Message...",
        "What have you been up to today? Message...",
        "Beautiful day, isn't it? Message...",
        "Was the weather nice? Message...",
        "You look good today! Message...",
        "What dreams did you see last night? Message...",
        "What did you do today? Message...",
        "What did you eat today? Message...",
        "Have you drank enough water? Message...",
        "Remember to stretch! Message...",
        "≖‿≖ I live inside of your walls. Message...",
        "(✿◠‿◠) Message...",
    ]);
}
  
/*/////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
DO NOT PROCEED IF YOU DO NOT KNOW WHAT YOU'RE DOING
///////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
  
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// returns a random item from array
const randItem = itemArr => itemArr[Math.floor(Math.random() * itemArr.length)];
  
// removes the Reddit prefix
const removePrefix = username => ["r/","u/"].some(tag => username.includes(tag)) ? username.slice(2) : username;
  
// adds the Reddit prefix if nonexistant
const keepPrefix = (username, subreddit) => ["r/","u/"].some(tag => username.includes(tag)) ? username : subreddit ? `r/${username}` : `u/${username}`;

const recipientUsername = () => {
    const defaultUsernameElem = $(".InfoBar__username");
    const ModmailPlusPlusUsernameElem = $(".CustomInfoBar__username");
    
    if(defaultUsernameElem) {
        return removePrefix(defaultUsernameElem?.innerText);
    } 
    else if (ModmailPlusPlusUsernameElem) {
        return removePrefix(ModmailPlusPlusUsernameElem?.innerText);
    }
    else {
        return undefined;
    }
};
  
async function Get(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text;
};

async function getUserInfo() {
    try
    {
        const about = await Get(`https://www.reddit.com/user/${recipientUsername()}/about.json`);
        return JSON.parse(about);
    }
    catch
    {
        console.log("[Modmail++] %cFailed to load user information.", "color: red");
        return 0;
    }
};
  
async function getRules(Settings) {
    try
    {
        const rules = await Get(Settings.rules + ".json");
        return JSON.parse(rules);
    }
    catch
    {
        console.log("[Modmail++] %cFailed to load subreddit rules, possibly a private subreddit?", "color: red");
        return 0;
    }
};

// adds a zero suffix if x < 10
const fixNumber = number => number < 10 ? "0" + number : number;

// returns a date string from UNIX timestamp
function unixToDate(UNIX_timestamp) {
    const d = new Date(UNIX_timestamp * 1000);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const year = d.getFullYear(),
    monthNum = d.getMonth() + 1,
    month = months[d.getMonth()],
    date = d.getDate(),
    hour = fixNumber(d.getHours()),
    min = fixNumber(d.getMinutes()),
    sec = fixNumber(d.getSeconds());

    return `${date}.${monthNum}.${year} ${hour}:${min}:${sec}`; // (DD/MM/YY HH/MM/SS)
};

// returns a string without evil HTML elements
function sanitize(evilstring) {
    const decoder = document.createElement('div');
    decoder.innerHTML = evilstring;
    return decoder.textContent;
};

// add a link to the Modmail text and change its name to Modmail++
const sidebarTitle = $(".Sidebar__titleMessage");
sidebarTitle.setAttribute("onclick","window.open('https://github.com/Hakorr/Userscripts/tree/main/Reddit.com/ModmailExtraInfo')");
sidebarTitle.setAttribute("style","cursor: pointer");
sidebarTitle.innerText = "Modmail++";

// apply the custom css
function applyCSS(Settings) {
    //Took advice for the listbox CSS from moderncss.dev/custom-select-styles-with-pure-css, thanks!
    const css = `.profileIcon:hover {
        -ms-transform: scale(6);
        -webkit-transform: scale(6);
        transform: scale(6);
    }
    .profileIcon {
        position: relative;
        bottom: 4px;
        margin-bottom: 10px;
        float: left; border-radius: 50%;
        transition: transform .1s;
    }
    .InfoBar__recentsNone {
        color: #6e6e6e;
    }
    .InfoBar__metadata, .InfoBar__recents {
        margin: 6px 0;
        margin-left: 10px;
    }
    .value {
        color: ${Settings.dataColor};
    }
    .InfoBar__banText {
        padding-bottom: 15px;
    }
    .InfoBar__username, .InfoBar__username:visited {
        padding-left: 10px;
    }
    .dataText {
        color: ${Settings.textColor};
        font-size: 13px;
        padding-left: 10px;
    }
    .dataTitle {
        color: ${Settings.titleColor};
        font-size: 15px;
        margin-bottom: 3px;
        margin-top: 5px;
    }
    .responseListbox {
        width: 50%;
        cursor: pointer;
    }
    :root {
        --select-border: #0079d3;
        --select-focus: blue;
        --select-arrow: var(--select-border);
    }
    *,
    *::before,
    *::after {
    box-sizing: border-box;
    }
    select {
        appearance: none;
        background-color: ${Settings.listBoxColor};
        color: ${Settings.textColor};
        border: none;
        padding: 0 1em 0 0;
        margin: 0;
        width: 100%;
        cursor: pointer;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        position: relative;
    }
    .select {
        width: 100%;
        min-width: 15ch;
        max-width: 30ch;
        border: 1px solid var(--select-border);
        border-radius: 0.25em;
        padding: 0.3em 0.4em;
        font-size: 0.9rem;
        line-height: 1.1;
        background-color: ${Settings.listBoxColor};
        margin-bottom: 15px;
    }
    select::-ms-expand {
        display: none;
    }
    option {
        white-space: normal;
        outline-color: var(--select-focus);
    }
    select:focus + .focus {
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border: 2px solid var(--select-focus);
        border-radius: inherit;
    }
    .Author__text {
        padding: 6px 0;
    }
    .chatProfileIcon {
        margin-right: 7px;
        transition: transform .1s;
        border-radius: 50%;
    }
    .App__page {
        background: var(--color-tone-8);
    }
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        background: ${Settings.listBoxColor};
    }
    ::-webkit-scrollbar-thumb {
        background: #888;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    .subredditRuleList {
        --newRedditTheme-bodyText: ${Settings.titleColor};
        --newRedditTheme-metaText: ${Settings.textColor};
        --newRedditTheme-navIconFaded10: rgba(215,218,220,0.1);
        --newRedditTheme-actionIconTinted80: #9a9b9c;
        --newRedditTheme-activeShaded90: #006cbd;
        --newRedditTheme-actionIconAlpha20: rgba(129,131,132,0.2);
        --newCommunityTheme-actionIcon: #818384;
        --newRedditTheme-bodyTextAlpha03: ${Settings.listBoxColor};
        --newRedditTheme-navIcon: #D7DADC;
        --newCommunityTheme-line: #343536;
        --newCommunityTheme-body: #1A1A1B;
    }
    .ruleList {
        padding: 0 24px 0 20px;
        background: var(--newRedditTheme-bodyTextAlpha03);
        max-height: 100%;
    }
    html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, button, cite, code, del, dfn, em, img, input, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    .dialogWindow {
        pointer-events: auto;
    }
    .ruleDiv {
        -ms-flex-align: center;
        align-items: center;
        box-sizing: border-box;
        display: -ms-flexbox;
        display: flex;
        height: 100%;
        padding: 75px 30px 20px;
        pointer-events: none;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 55;
    }
    .dialogWindow {
        background-color: var(--newCommunityTheme-body);
        border: 1px solid var(--newCommunityTheme-line);
        border-radius: 4px;
        box-shadow: 0 2px 20px 0 rgb(0 0 0 / 30%);
        margin: auto;
        pointer-events: auto;
        z-index: 55;
    }
    .listWindow {
        width: 550px;
        position: relative;
    }
    .ruleHeader {
        height: 50px;
        border-bottom: 1px solid var(--newRedditTheme-bodyTextAlpha03);
        position: relative;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 24px 0 20px;
        margin: 0 -24px 0 -20px;
        font-weight: 700;
        font-size: 14px;
        color: var(--newRedditTheme-metaText);
    }
    .infoIcon {
        background: #86848412;
        border-radius: 8px;
        padding: 10px 16px 10px 12px;
        display: -ms-flexbox;
        display: flex;
        box-sizing: border-box;
        margin-top: 16px;
    }
    .bottomFooter {
        box-shadow: 0 -1px 0 var(--newRedditTheme-bodyTextAlpha03);
        padding: 20px 0 16px;
        min-height: 80px;
        display: -ms-flexbox;
        display: flex;
        box-sizing: border-box;
        bottom: 0;
        left: 0;
    }
    .closeIconSVG {
        margin-left: auto;
        margin-right: -4px;
        cursor: pointer;
        height: 20px;
        padding: 4px;
        width: 20px;
        fill: var(--newCommunityTheme-actionIcon);
    }
    .infoIconSVG {
        -ms-flex: 0 0 20px;
        flex: 0 0 20px;
        width: 20px;
        margin-right: 12px;
        fill: #878a8c;
    }
    .selectButton:disabled {
        opacity: .5;
    }
    .selectButton {
        margin-top: 8px;
        -ms-flex: 0 0 150px;
        flex: 0 0 150px;
        background: var(--newRedditTheme-activeShaded90);
        height: 31px;
        border-radius: 100px;
        color: #fff;
        -ms-flex-item-align: end;
        align-self: flex-end;
        margin-left: auto;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .05em;
        outline: none!important;
    }
    .infoBox {
        -ms-flex: 0 1 auto;
        flex: 0 1 auto;
        font-size: 14px;
        line-height: 1.45;
        letter-spacing: -.01em;
        color: var(--newRedditTheme-metaText);
    }
    .infoBox a {
        color: #24a0ed;
    }
    button {
        background: transparent;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: initial;
    }
    input {
        -webkit-writing-mode: horizontal-tb !important;
        text-rendering: auto;
        color: -internal-light-dark(black, white);
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: start;
        appearance: auto;
        background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
        -webkit-rtl-ordering: logical;
        cursor: text;
        margin: 0em;
        font: 400 13.3333px Arial;
        padding: 1px 2px;
        border-width: 2px;
        border-style: inset;
        border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
        border-image: initial;
    }
    body {
        min-height: calc(100vh - 48px);
        line-height: 1;
        font-family: IBMPlexSans, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
    }
    ._3kEv5z1lDKGV8PQ5ijp4Uh {
        background-size: 24px 24px;
        background-position: 11px 6px;
        padding-left: 42px!important;
        background-repeat: no-repeat;
    }
    .title {
        margin-top: 16px;
        font-size: 16px;
        line-height: 1.2;
        font-weight: 700;
        color: var(--newRedditTheme-bodyText);
    }
    .fieldSet {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        box-sizing: border-box;
    }
    .listValue label {
        padding: 0 72px 0 20px;
        display: -ms-flexbox;
        display: flex;
        height: 100%;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        color: var(--newRedditTheme-metaText);
        position: relative;
    }
    .listValue {
        box-sizing: border-box;
        height: 64px;
        border-top: 1px solid var(--newRedditTheme-navIconFaded10);
    }
    .listBox {
        margin: 16px -24px 0 -20px;
        max-height: 60vh;
        min-height: 100px;
        overflow: auto;
    }
    .listValue input {
        visibility: hidden;
        display: none;
    }
    .StyledHtml tr {
        color: ${Settings.titleColor};
    }
    .StyledHtml td {
        color: ${Settings.textColor};
    }
    #CustomMetadata {
        font-size: 13px;
        line-height: 1.5;
    }
    .CustomInfoBar__username {
        padding-left: 10px;
        font-size: 18px;
        line-height: 1;
        padding-bottom: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-decoration: none;
        color: var(--color-tone-1);
    }
    .CustomSeperator {
        position: relative;
        border-top: 1px solid var(--color-tone-6);
        margin-top: 16px;
        margin-bottom: 16px;
    }
    @media (min-width: 768px)
    .ThreadViewer__infobarContainer {
        display: table;
    }
    #currentlySelected {
        background-color: rgba(121, 121, 121, 0.35);
    }
    .ruleDiv {
        background-color: rgba(26, 26, 27, 0.6); 
        visibility: hidden;
    }`;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.id = "modmailPlusSheet";
    styleSheet.innerText = css;
  
    if($$("#modmailPlusSheet").length == 0)
      document.head.appendChild(styleSheet);
};

function initializeCore(Settings) {
    /*  About the core
     *  - it contains functions required for handling different in-page-actions, such as hiding a div
     *  - references to variables outside the core and the document will not be recognized
     * */
    class Core {
        ruleListActivator = "<open-rulelist-dialog>";

        listBoxChanged(responseIndex) {
            const message = document.ModmailPlus.responses[responseIndex].content;

            if(message == this.ruleListActivator)
            {
                const ruleDiv = document.getElementsByClassName("ruleDiv")[0];
                ruleDiv.style.visibility = "visible";
            }
            else
            {
                const userVisitingCreatePostPage = document.querySelectorAll(".NewThread").length;

                const messageBox = userVisitingCreatePostPage
                    ? document.querySelector(".Textarea, NewThread__message")
                    : document.getElementById("realTextarea");

                const response = document.ModmailPlus.responses.find(x => x.content == message);

                response.replace ? messageBox.value = message : messageBox.value += message;

                if(response.subject) {
                    document.querySelector(".NewThread__subject").value = response.subject;
                }

                console.log("[Modmail++] Updated the message: %c" + messageBox.value,"color: orange");
            }
        }

        // implement listbox select highlight
        selected(element) {
            const selectedElem = document.getElementById("currentlySelected");

            // if an element already selected, reset the id and set its background color to nothing
            if(selectedElem)
                selectedElem.removeAttribute("id");

            element.parentElement.id = "currentlySelected";
            document.getElementsByClassName("selectButton")[0].disabled = false;
        }

        removeBreaks = text => text.replace(/(\r\n|\n|\r)/gm, "");

        selectButtonClicked() {
            const selectedElem = document.getElementById("currentlySelected");
            const userVisitingCreatePostPage = document.querySelectorAll(".NewThread").length;

            const messageBox = userVisitingCreatePostPage
                ? document.querySelector(".Textarea, NewThread__message")
                : document.getElementById("realTextarea");

            if(selectedElem)
            {
                const selectedRule = document.ModmailPlus.rules[selectedElem.getAttribute('value')];
                const ruleName = selectedRule.short_name;
                const ruleDescription = selectedRule.description;
                const fixedDescription = ruleDescription.replaceAll("\n","\n> ") + '\n\n';
              
                const message = `> [**${ruleName}**]\n>\n> ${fixedDescription}`;

                const response = document.ModmailPlus.responses.find(x => x.content == this.ruleListActivator);
              
                response.replace // if to replace or add text to the messagebox
                    ? messageBox.value = message 
                    : messageBox.value += message;

                console.log("[Modmail++] New messageBox value: %c" + messageBox.value,"color: orange");

                this.closeIconClicked();
            }
        }

        closeIconClicked() {
            const ruleDiv = document.querySelector(".ruleDiv");
            ruleDiv.style.visibility = "hidden";
        }
      
        divertQuoteText() {
            console.log("[Modmail++] %cDiverting quote text from original textbox to Modmail++'s", "color: orange");
            setTimeout(() => {
                const originalForm = document.querySelector(".Textarea, .ThreadViewerReplyForm__replyText");
                const originalValue = originalForm.value;
              
                let text = "";

                if(originalValue.includes("\n\n"))
                    text = originalValue.split("\n\n").filter(x => x.length > 0).pop();
                else
                    text = originalValue;

                if(text.indexOf("\n") == 0) text = text.slice(1);

                if(text && text.includes("said:"))
                    document.querySelector("#realTextarea").value += text + "\n\n";
            }, 50);
        }
      
        clearReplyForm() {
            setTimeout(() => {
                document.getElementById("realTextarea").value = "";
                console.log("[Modmail++] Cleared the textarea!");
              
                // set onclick variable again because the button refreshes itself
                document.querySelector(".ThreadViewerReplyForm__replyButton")
                    .setAttribute("onclick", "document.ModmailPlus.Core.clearReplyForm()")
            }, 500);
        }
    };
  
    document.ModmailPlus.Core = new Core;
    document.ModmailPlus.responses = Settings.responses;
};

async function appendChatProfileIcons() {
    const user = await getUserInfo();

    // icon element
    const chatProfileIcon = document.createElement('div');
    chatProfileIcon.innerHTML = `<img class="chatProfileIcon" src="${user.data.icon_img}" width="25">`;

    const authors = $$(".ThreadPreview__author");
  
    if(authors) {
        authors.forEach((author, index) => {
            // get username (u/xxxxxx)
            const name = $$(".Author__text")[index].innerText;

            // check if there is an icon appended already
            const exists = author.childNodes.length == 1 ? false : true;

            if(removePrefix(name) == recipientUsername() && !exists) // if the username is the user (non-mod)
            {
                // append the icon next to the username -> [icon] u/username
                author.insertBefore(chatProfileIcon.cloneNode(true), author.firstChild);
            }
        });
    }
};

async function appendUserInfo(Settings) {
    const user = await getUserInfo();

    if(user)
    {
        // userinfo element
        const userDetails = document.createElement('div');
        userDetails.id = "CustomMetadata";
        userDetails.innerHTML = `<img class="profileIcon" src="${user.data.icon_img}" width="25"/>
                <a class="CustomInfoBar__username" href="https://www.reddit.com/user/${user.data.name}" target="_blank">${removePrefix(user.data.subreddit.display_name_prefixed)}</a>
                <h1 style="color: ${Settings.textColor} ; font-size: 11px; margin-top: 17px; margin-bottom: 10px;">${sanitize(user.data.subreddit.public_description)}</h1>
                <h1 class="dataTitle">Main</h1>
                <div class="dataText">
                    <p>Created: <span class="value">${unixToDate(user.data.created)}</span></p>
                    <p>UserID: <span class="value">${user.data.id}</span></p>
                    <p>Verified: <span class="value">${user.data.verified}</span></p>
                    <p>Employee: <span class="value">${user.data.is_employee}</span></p>
                    <p>NSFW Profile: <span class="value">${user.data.subreddit.over_18}</span></p>
                </div>
                <h1 class="dataTitle">Karma</h1>
                <div class="dataText">
                    <p>Post: <span class="value">${user.data.link_karma}</span></p>
                    <p>Comment: <span class="value">${user.data.comment_karma}</span></p>
                    <p>Total: <span class="value">${user.data.total_karma}</span></p>
                    <p>Awardee: <span class="value">${user.data.awardee_karma}</span></p>
                    <p>Awarder: <span class="value">${user.data.awarder_karma}</span></p>
                </div>
                <h1 class="dataTitle">Links</h1>
                    <div style="padding-left: 10px;">
                    <a class="InfoBar__recent" href="https://redditmetis.com/user/${user.data.name}" target="_blank">Redditmetis</a>
                    <a class="InfoBar__recent" href="https://www.reddit.com/search?q=${user.data.name}" target="_blank">Reddit Search</a>
                    <a class="InfoBar__recent" href="https://www.google.com/search?q=%22${user.data.name}%22" target="_blank">Google Search</a>
                </div>`

        // seperator element
        const seperator = document.createElement('div');
        seperator.classList.add("CustomSeperator");
        
        if(!$("#CustomMetadata")) {
            // append the elements
            $(".InfoBar").insertBefore(userDetails, $(".InfoBar__username")); // append user information on top of the sidebar
            $(".InfoBar").insertBefore($(".InfoBar__modActions"), $(".InfoBar__recents")); // move modActions on top of recent posts

            if($(".InfoBar__banText"))
                $(".InfoBar").insertBefore($(".InfoBar__banText"), $("#CustomMetadata"));

            $(".InfoBar__username").outerHTML = ""; // delete the original username element
            $(".InfoBar__metadata").outerHTML = ""; // delete the original metadata
        }
    }
};

function replaceReplyForm(Settings) {
    // hide the original replyform textarea
    $(".ThreadViewerReplyForm__replyText").style.cssText += 'display: none';

    // create and append a new replyform textarea
    const newReplyForm = document.createElement("textarea");
    newReplyForm.setAttribute('class', 'Textarea ThreadViewerReplyForm__replyText ');
    newReplyForm.setAttribute('id', 'realTextarea');
    newReplyForm.setAttribute('name', 'body');
    newReplyForm.setAttribute('placeholder', `${Settings.placeholderMessage}`);
  
    $(".ThreadViewerReplyForm").insertBefore(newReplyForm, $(".ThreadViewerReplyForm__replyFooter"));

    // make the reply button clear the new replyform
    $(".ThreadViewerReplyForm__replyButton").setAttribute("onclick", "document.ModmailPlus.Core.clearReplyForm()");
};

async function appendResponseTemplateBox(Settings) {
    const responseTemplateElement =
    `<h2 class="dataTitle">Response Templates</h2>
    <select id="responseListbox" onchange="document.ModmailPlus.Core.listBoxChanged(this.value);" onfocus="this.selectedIndex = -1;"/>
        <option selected disabled hidden>Select a template</option>
    <span class="focus"></span>`;

    const responseTemplateParent = document.createElement('div');
    responseTemplateParent.classList.add("select", "customResponseBox");
    responseTemplateParent.innerHTML = responseTemplateElement;

    const userVisitingCreatePostPage = document.querySelectorAll(".NewThread").length;

    if(userVisitingCreatePostPage) // user visited mod.reddit.com/mail/create
    {
        // append the template box to the site
        $(".NewThread__fields").prepend(responseTemplateParent);
        $(".NewThread__fields").insertBefore($(".customResponseBox"), $(".Textarea, .NewThread__message"));
    }
    else // user visited modmail chat
    {
        // append the template box to the site
        $(".ThreadViewer__replyContainer").prepend(responseTemplateParent);
        $(".ThreadViewer__replyContainer").insertBefore($(".ThreadViewer__typingIndicator"), $(".select")); // append typing indicator before listbox
    }

    // populates the response template listbox
    function populateListbox(listBoxId) {
        const listBox = $(listBoxId);

        Settings.responses.forEach((response, i) => {
            const responseSubreddit = keepPrefix(response.subreddit.toLowerCase(), true);
            const currentSubreddit = keepPrefix(Settings.subTag.toLowerCase(), true);
            const sameSubreddit = currentSubreddit == responseSubreddit;
          
            if(sameSubreddit || response.subreddit.length == 0)
            {
                if(userVisitingCreatePostPage)
                {
                    listBox.options[listBox.options.length] = new Option(response.name, i);
                } 
                else
                {
                    if(!response.subject)
                    {
                        listBox.options[listBox.options.length] = new Option(response.name, i);
                    }
                }
            }
        });
    };

    populateListbox("#responseListbox"); // add all the responses to the response template listbox

    // creates and returns a list element
    function makeListValue(index, rule) {
        document.ModmailPlus.rules.push(rule);
      
        return `<div value='${index}' class="listValue">
                    <input onclick="document.ModmailPlus.Core.selected(this)" name="subredditRule" id='${"input_" + index}' type="radio">
                    <label for='${"input_" + index}'>${rule.short_name}</label>
                </div>`;
    };

    const ruleObj = await getRules(Settings);

    if(ruleObj)
    {
        $$(".subredditRuleList").forEach(elem => elem.remove()); // remove all subredditRuleList elements

        let listContent = "";

        ruleObj.rules.forEach((rule, index) => {
            listContent += makeListValue(index, rule)
        });

        // (Append) Div ruleList element to body
        const ruleList = document.createElement('div');
        ruleList.classList.add("subredditRuleList");
        ruleList.innerHTML = `<div class="ruleDiv">
                    <div aria-modal="true" class="dialogWindow" role="dialog" tabindex="-1">
                        <div class="listWindow">
                            <div class="ruleList">
                                <div class="ruleHeader">Select a rule<svg onclick="document.ModmailPlus.Core.closeIconClicked()" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="closeIconSVG"><polygon fill="inherit" points="11.649 9.882 18.262 3.267 16.495 1.5 9.881 8.114 3.267 1.5 1.5 3.267 8.114 9.883 1.5 16.497 3.267 18.264 9.881 11.65 16.495 18.264 18.262 16.497"></polygon></svg></div>
                                <fieldset class="fieldSet">
                                    <div class="title"><span>Which community rule did the user violate?</span></div>
                                    <div class="listBox">
                                        ${listContent}
                                    </div>
                                    <div class="infoIcon"><svg class="infoIconSVG" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g><path d="M10,8.5 C10.553,8.5 11,8.948 11,9.5 L11,13.5 C11,14.052 10.553,14.5 10,14.5 C9.447,14.5 9,14.052 9,13.5 L9,9.5 C9,8.948 9.447,8.5 10,8.5 Z M10.7002,5.79 C10.8012,5.89 10.8702,6 10.9212,6.12 C10.9712,6.24 11.0002,6.37 11.0002,6.5 C11.0002,6.57 10.9902,6.63 10.9802,6.7 C10.9712,6.76 10.9502,6.82 10.9212,6.88 C10.9002,6.94 10.8702,7 10.8302,7.05 C10.7902,7.11 10.7502,7.16 10.7002,7.21 C10.6602,7.25 10.6102,7.29 10.5512,7.33 C10.5002,7.37 10.4402,7.4 10.3812,7.42 C10.3202,7.45 10.2612,7.47 10.1902,7.48 C10.1312,7.49 10.0602,7.5 10.0002,7.5 C9.7402,7.5 9.4802,7.39 9.2902,7.21 C9.1102,7.02 9.0002,6.77 9.0002,6.5 C9.0002,6.37 9.0302,6.24 9.0802,6.12 C9.1312,5.99 9.2002,5.89 9.2902,5.79 C9.5202,5.56 9.8702,5.46 10.1902,5.52 C10.2612,5.53 10.3202,5.55 10.3812,5.58 C10.4402,5.6 10.5002,5.63 10.5512,5.67 C10.6102,5.71 10.6602,5.75 10.7002,5.79 Z M10,16 C6.691,16 4,13.309 4,10 C4,6.691 6.691,4 10,4 C13.309,4 16,6.691 16,10 C16,13.309 13.309,16 10,16 M10,2 C5.589,2 2,5.589 2,10 C2,14.411 5.589,18 10,18 C14.411,18 18,14.411 18,10 C18,5.589 14.411,2 10,2"></path></g></svg>
                                        <div class="infoBox">
                                            <p><span>Not sure? </span><a href="https://www.reddit.com/${keepPrefix(Settings.subTag)}/about/rules" target="_blank" rel="noopener noreferrer">Read ${Settings.subTag}'s rules</a></p>
                                        </div>
                                    </div>
                                    <footer class="bottomFooter"><button type="button" disabled="" onclick="document.ModmailPlus.Core.selectButtonClicked()" class="selectButton">Select</button></footer>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>`;
        $("body").appendChild(ruleList);
    }
};

function fixQuoteButtons() {
    /* On click, do this
        1) take the text from the original form
        2) split it by two new lines
        3) take the last result (last quoted message)
        4) paste the last result to the new form
    */

    $$(".Message__quote").forEach(elem => {
        if(!elem.getAttribute("onclick"))
            elem.setAttribute("onclick", "document.ModmailPlus.Core.divertQuoteText()");
    });
};
  
function handleCreateMessagePage() {
    /* Handle change of username
     * change the response usernames to the changed username
     * */
    const toUser = document.querySelector(".Radio__input[value=user]");
  
    if(toUser) {
        toUser.onclick = () => {
            let lastUsername = null;

            const waitForTextbox = setInterval(() => {
                const newThreadTextbox = document.querySelector(".NewThread__username");

                if(newThreadTextbox) {
                    clearInterval(waitForTextbox);

                    newThreadTextbox.onchange = e => {
                        const username = "u/" + e.target.value;
                        const defaultLastUsername = "u/undefined";

                        document.ModmailPlus.responses.forEach(response => {
                            if(response.subject) {
                                response.subject = response.subject.replaceAll(lastUsername || defaultLastUsername, username);
                            }
                                
                            response.content = response.content.replaceAll(lastUsername || defaultLastUsername, username);
                        })

                        lastUsername = username;
                    }
                }
            }, 100);
        }
    }
  
    /* Handle change of subreddit
     * change the response subreddits to the changed subreddit
     * */
    const srName = document.querySelector("[name=srName]");
    const defaultLastSubreddit = "r/subreddit";
    let lastSubreddit = null;

    if(srName) {
        const postToChanges = setInterval(() => {
            const subreddit = "r/" + srName.value;

            if(subreddit != lastSubreddit && subreddit != 'r/') {
                document.ModmailPlus.responses.forEach(response => {
                    if(response.subject) {
                        response.subject = response.subject.replaceAll(lastSubreddit || defaultLastSubreddit, subreddit);
                    }
                  
                    response.content = response.content.replaceAll(lastSubreddit || defaultLastSubreddit, subreddit);
                })

                lastSubreddit = subreddit;
            }
        }, 500);
    }
};

const __main__ = async () => {
    console.log("[Modmail++] %cMain function ran!", "color: grey");
  
    const Settings = new __settings__();
    document.ModmailPlus = {};
    document.ModmailPlus.rules = [];

    // These will be executed in any page //
  
    if(!document.ModmailPlus.length)
        initializeCore(Settings);
    
    if(Settings.enableCustomResponses && !$("#responseListbox"))
        appendResponseTemplateBox(Settings);
  
    applyCSS(Settings);
  
    ////////////////////////////////////////
  
    if(!$(".NewThread")) // execute in chat page only
    {
        appendUserInfo(Settings); // if the element already exists will be checked before appending
  
        if(Settings.chatProfileIcons && !$(".chatProfileIcon"))
            appendChatProfileIcons();
      
        if(!$("#realTextarea"))
            replaceReplyForm(Settings);
      
        fixQuoteButtons();
    } 
    else // execute in create message page only
    {
        handleCreateMessagePage();
    }

    console.log("[Modmail++] %cLoaded!", "color: lime");
    console.log("[Modmail++]", document.ModmailPlus);
};

let URLChangeDetectorActive = false;

// this is a hot mess, please help me
setInterval (() => {
    if(this.lastPathStr != location.pathname)
    {
        this.lastPathStr = location.pathname;

        console.log("[Modmail++] %cNew page detected!", "color: gold");

        URLChangeDetectorActive = true;

        const waitForElements = setInterval (() => {
            if($(".NoThreadMessage__generic") && URLChangeDetectorActive) // add confetti explosion if no mail
            {
                clearInterval(waitForElements);
                URLChangeDetectorActive = false;

                console.log("[Modmail++] %cNo modmail!", "color: lime");

                party.confetti($(".NoThreadMessage__generic"), {
                        count: 15,
                        spread: 50
                });
            }

            if($(".InfoBar") && URLChangeDetectorActive) // user is on modmail "chat" page
            {
                clearInterval(waitForElements);
                URLChangeDetectorActive = false;

                if($("body") && !$("#CustomMetadata"))
                    __main__();
            }
          
            if($(".NewThread") && URLChangeDetectorActive) // user is on the create new message page
            { 
                clearInterval(waitForElements);
                URLChangeDetectorActive = false;
                
                __main__();
            }
        }, 5);
    }
}, 100);
})();
