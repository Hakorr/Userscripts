// ==UserScript==
// @name        MassBlocker (Alpha)
// @namespace   HKR
// @match       *.reddit.com/*
// @exclude     *.reddit.com/settings/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @version     0.2
// @author      HKR
// @description Automatically block users that are shown on the page
// @require     https://raw.githubusercontent.com/Hakorr/AttributeDeobfuscator/main/attributedeobfuscator.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @run-at      document-start
// ==/UserScript==

(() => {
    console.log("MassBlocker loading...");
    const Deobfuscator = new AttributeDeobfuscator();

    // show the alert before executing MassBlocker
    const SHOW_WARNING = true;

    // usernames not to block - case sensitive
    let USER_EXCLUSIONS = [
        // your account's already here
        "reddit",
        "AutoModerator",
        "request_bot",
        "RedditCareResources",
        "Blocked account"
    ];

    const databaseKeys = {
        username: {
            scraped: "scrapedUsernames",
            blocked: "blockedUsernames"
        }
    };

    const addPrefix = username => username.includes("u/") ? username : `u/${username}`;
    const removePrefix = (...usernames) => usernames.length == 1
        ? usernames[0].includes("u/") 
            ? usernames[0].slice(2) 
            : usernames[0]
        : usernames.map(username => username.includes("u/") ? username.slice(2) : username);

    USER_EXCLUSIONS = removePrefix(USER_EXCLUSIONS);

    const delay = n => new Promise((resolve) => setTimeout(resolve, n));

    const UI = {
        setMode: text => document.querySelector("#massBlockerMode").innerText = `MassBlocker ${text}`,
        setInfo: text => document.querySelector("#massBlockerInfo").innerText = text,
        setCount: (blockedAmount, unblockedAmount) => document.querySelector("#massBlockerCount").innerText = `Processed (${blockedAmount}/${unblockedAmount})`,
        setBgColor: hex => document.querySelector("#massBlockerLayer").style["background-color"] = hex,
        setStatus: {
            failed: (text, status) => {
                UI.setMode(status);
                UI.setInfo(text);
                UI.setCount(0, 0);
                UI.setBgColor("#7c0000");
            },
            cancelled: (text, status) => {
                UI.setMode(status);
                UI.setInfo(text);
                UI.setCount(0, 0);
                UI.setBgColor("#676869");
            },
            blocking: (blockedAmount, scrapedAmount) => {
                UI.setCount(blockedAmount, scrapedAmount);
                UI.setMode("running");
                UI.setInfo("Scraping and blocking...");
                UI.setBgColor("#057c00");
            }
        }
    };

    const getSecrets = callback => {
        /* This function is responsible for retrieving a JSON object from the document
         * - the object contains the token for the http request
         * - the object is removed right after DOM has loaded, so it's hard to get
         * Functionality is as follows,
         * - observe script loads -> if the inner text has the JSON object, parse it
         * 
         * (If MassBlocker is returning a token error, fix this function)
         * */
        
        (() => {
            'use strict';

            const observerCallback = (mutationsList) => {
                for (let mutationRecord of mutationsList) {
                    for (let node of mutationRecord.addedNodes) {
                        if (node.tagName !== 'SCRIPT') continue;

                        if(node.innerText.includes("data")) {
                            handleDataElement(node.innerText);
                        }
                    };
                };
            };

            const mutObvsr = new MutationObserver(observerCallback);
            mutObvsr.observe(document, { childList: true, subtree: true });
        })();

        function handleDataElement(innerText) {
            innerText = innerText.replace("window.___r = ", "");
            innerText = innerText.slice(0, -1);

            try {
                const secretObj = JSON.parse(innerText);
                callback(secretObj); // call main function with the secret JSON object
            } catch {
                callback(false); // call main function with false, execution will be stopped
            }
        }
    };

    let secrets = {};
    getSecrets(secretObj => Deobfuscator.ready(() => main(secretObj)));

    const loadFromDatabase = async (value, invalid) => {
        return await GM_getValue(value, invalid);
    };

    const createDatabases = () => {
        const database = databaseKeys.username;

        Object.keys(database)
            .forEach(async value => {
                const loadedDatabase = await loadFromDatabase(database[value], false);

                if(loadedDatabase == false)
                {
                    GM_setValue(database[value], []);
                }
            });

        return true;
    };

    const pushToDatabase = async (key, usernameArr) => {
        if(typeof usernameArr == "object" && usernameArr.length > 0)
        {
            const currentDatabase = await loadFromDatabase(key); // get current database

            const oppositeDatabase = key == databaseKeys.username.scraped
                ? await loadFromDatabase(databaseKeys.username.blocked)
                : await loadFromDatabase(databaseKeys.username.scraped);

            const duplicatesRemoved = usernameArr.filter(x => !currentDatabase.includes(x) && !oppositeDatabase.includes(x));

            if(duplicatesRemoved.length > 0)
            {
                GM_setValue(key, currentDatabase.concat(...duplicatesRemoved)); // set current database
                return true;
            }
        }

        return false;
    };

    const removeFromDatabase = async (key, usernameArr) => {
        if(typeof usernameArr == "object" && usernameArr.length > 0)
        {
            const databaseToRemoveFrom = await loadFromDatabase(key); // get current database

            const newDatabase = databaseToRemoveFrom.filter(item => !usernameArr.includes(item));

            if(typeof newDatabase == "object")
            {
                GM_setValue(key, newDatabase); // set current database
                return true;
            }
        }

        return false;
    };

    const scrapeUsernames = (classNameArr) => {
        let scrapedArr = [];

        classNameArr.forEach(className => {
            if(className) 
            {
                const querySelector = Deobfuscator.toQuerySelector(className);

                const querySelectorResults = [...document.querySelectorAll(querySelector)];

                const cleanedQuerySelectorResults = [...document.querySelectorAll(querySelector)]
                    .map(element => removePrefix(element.innerText))  // remove prefix
                    .filter(x => !USER_EXCLUSIONS.includes(x));       // remove excluded usernames

                scrapedArr.push(...cleanedQuerySelectorResults);

                // add scraped username effect (colored text)
                querySelectorResults.forEach(usernameElem => {
                    usernameElem.style.color = "#ff0303";
                    usernameElem.style["text-shadow"] = "0px 0px 5px #ff0101ba";
                });
            }
        });

        scrapedArr = [...new Set(scrapedArr)]; // remove duplicate values

        if(scrapedArr.length > 0)
        {
            return scrapedArr;
        }
        else
        {
            return [];
        }
    };

    // https://stackoverflow.com/a/38903810
    function AjaxRetry(settings, maxTries, interval) {
        const self = this;
        this.settings = settings;
        this.maxTries = typeof maxTries === "number" ? maxTries : 0;
        this.completedTries = 0;
        this.interval = typeof interval === "number" ? interval : 0;

        // Return a promise, so that you can chain methods
        // as you would with regular jQuery ajax calls
        return tryAjax().promise();

        function tryAjax(deferred) {
            console.log("Attempting to block #" + (self.completedTries + 1));
          
            const d = deferred || $.Deferred();
            $.ajax(self.settings)
                .done(function(data) {
                    // If it succeeds, don't keep retrying
                    d.resolve(data);
                })
                .fail(function(error) {
                    self.completedTries++;

                    // Recursively call this function again (after a timeout)
                    // until either it succeeds or we hit the max number of tries
                    if (self.completedTries < self.maxTries)
                    {
                        setTimeout(() => {
                            tryAjax(d);
                        }, self.interval);
                    } 
                    else
                    {
                        d.reject(error);
                    }
                });
          
            return d;
        }
    };
  
    let dailyLimitReached = false;
    const blockUser = username => {
        const auth = `Bearer ${secrets?.user?.session?.accessToken}`;

        if(!secrets?.user?.session?.accessToken) return "invalid auth";
        if(!username.length) return "no username given";

        const settings = {
           ajax: {
               url: "https://oauth.reddit.com/api/block_user?raw_json=1",
               type: 'POST',
               data: {
                  'name': username 
               },
               headers: {
                   'Accept': '*/*',
                   'Content-Type': 'application/x-www-form-urlencoded',
                   'authorization': auth
               }
           },
           maxTries: 2,
           interval: 1000
        };

        return new Promise((resolve, reject) => {
            new AjaxRetry(settings.ajax, settings.maxTries, settings.interval)
                .done(data => {
                    removeFromDatabase(databaseKeys.username.scraped, [username]);
                    pushToDatabase(databaseKeys.username.blocked, [username]);
              
                    resolve(data);
                })
                .fail(error => {
                    switch(error?.responseJSON?.reason) {
                        case "BLOCK_RATE_LIMIT":
                              dailyLimitReached = true;
                              alert("You've reached the daily block limit! (About 50)\n\nThis can't be changed, Reddit's API doesn't allow it.");
                              break;
                        default:
                              console.log(`Error: ${error?.responseJSON?.reason}`);
                              break;
                    }
                    resolve(false);
                })
                .always(resp => {
                    console.log(`%cAjax requests for '${username}' finished.`, "color: orange");
                });
        });
    };
    
    const blockEveryone = async database => {
        const blockDelayMs = 250;
        
        for(index in database)
        {
            await delay(blockDelayMs);
          
            const username = database[index];
    
            console.log(`\n%cBlocking ${username}...\n`, "color: lime");
          
            const result = await blockUser(username);
          
            // update UI
            const scrapedDatabase = await loadFromDatabase(databaseKeys.username.scraped);
            const blockedDatabase = await loadFromDatabase(databaseKeys.username.blocked);
            UI.setStatus.blocking(blockedDatabase.length, scrapedDatabase.length);
          
            if(dailyLimitReached) break;
        }

        return; // after every account from the database was blocked
    };

    let lastDatabase = [];
    const watchDatabase = async () => {

        const checkChanges = async () => {
            if(dailyLimitReached) clearInterval(watchLoop);
          
            const currentDatabase = await loadFromDatabase(databaseKeys.username.scraped);
            if(JSON.stringify(lastDatabase) != JSON.stringify(currentDatabase) && !dailyLimitReached)
            {
                clearInterval(watchLoop);

                console.log("%cDatabase changed! Blocking users...", "color: green");

                await blockEveryone(currentDatabase);

                console.log("%cBlocking finished!", "color: green");
              
                // update UI
                const scrapedDatabase = await loadFromDatabase(databaseKeys.username.scraped);
                const blockedDatabase = await loadFromDatabase(databaseKeys.username.blocked);
                UI.setStatus.blocking(blockedDatabase.length, scrapedDatabase.length);
                
                lastDatabase = currentDatabase;
                watchDatabase();
            }
        };

        let watchLoop = setInterval(() => checkChanges(), 1000);
    };

    const appendMainLayer = () => {
        const classList = {
            header: Deobfuscator.toQuerySelector(
                Deobfuscator.obfuscateClass("HeaderDynamicStyles container header")
            ),
            main: Deobfuscator.toQuerySelector(
                Deobfuscator.obfuscateClass("main")
            ),
            overlay: Deobfuscator.toQuerySelector(
                Deobfuscator.obfuscateClass("overlayScrollContainer")
            ),
            shortcut: Deobfuscator.toQuerySelector(
                Deobfuscator.obfuscateClass("shortcutDiv")
            ),
            commentSection: Deobfuscator.toQuerySelector(
                Deobfuscator.obfuscateClass("CommentsPaneWrapper mIsInOverlay")
            )
        };

        GM_addStyle(`
            ${classList.main} {
                margin-top: 25px; 
            }
            ${classList.overlay} {
                margin-top: 25px;
            }
            ${classList.shortcut} {
                margin-top: 25px;
            }
            #massBlockerLayer { 
                width: 100%;
                height: 25px;
                background-color: #676869;
                z-index: 99;
                position: absolute;
                margin-top: 74px;
                -moz-transition: all .2s ease-in;
                -o-transition: all .2s ease-in;
                -webkit-transition: all .2s ease-in;
                transition: all .2s ease-in;
                box-shadow: 0px 4px #00000030;
            }
            .massBlockerText {
                color: white;
            }
            .massBlockerContainer {
                display: grid; 
                grid-template-columns: 0.7fr 1.4fr 0.9fr;
                gap: 0px 0px; 
                grid-template-areas: 
                "left middle right"
                ". . ."
                ". . ."; 
                padding: 3px 20px;
            }
            .massBlockerLeft {
                grid-area: left;
                text-align: left;
            }
            .massBlockerMiddle {
                grid-area: middle;
                text-align: center;
            }
            .massBlockerRight {
                grid-area: right;
                text-align: right;
            }
            #massBlockerCommentTip {
                margin-left: 25px;
                color: rgb(255, 3, 3);
                text-shadow: rgb(255 1 1 / 73%) 0px 0px 5px;
            }
        `);

        const massBlockerElement = document.createElement('div');
        massBlockerElement.id = "massBlockerLayer";
        massBlockerElement.innerHTML = `
        <div class="massBlockerContainer">
            <div class="massBlockerLeft">
                <a class="massBlockerText">
                    <a id="massBlockerMode" class="massBlockerText">
                        MassBlocker initialized
                    </a>
                </a>
            </div>
            <div class="massBlockerMiddle">
                <a id="massBlockerInfo" class="massBlockerText">
                    Please start using Reddit
                </a>
            </div>
            <div class="massBlockerRight">
                <a id="massBlockerCount" class="massBlockerText">
                    (0/0)
                </a>
            </div>
        </div>
        `;

        document.querySelector(classList.header).appendChild(massBlockerElement);

        /* For future use, possibly
        const commentTip = document.createElement('div')
        commentTip.innerHTML = `<a id="massBlockerCommentTip">CTRL + B to mass block commentors</a>`;

        document.arrive(classList.commentSection, () => {
            classList.commentSection.prepend(commentTip);
        });*/
    };

    let mainFunctionRan = false;

    /*  Functions which require Deobfuscator belong here */
    const main = async (secretObj) => {
        if(mainFunctionRan)
        {
            return;
        }
        else
        {
            mainFunctionRan = true;
        }

        if(!document.querySelector("#massBlockerLayer")) // MassBlocker not already injected
            appendMainLayer(); // append UI

        if(secretObj == false)
        {
            UI.setStatus.failed("Failed to load tokens. Please refresh the page.","stopped");
            mainFunctionRan = false;
            return;
        }
        else
        {
            secrets = secretObj;
        }
      
        const usersUsername = secretObj?.user?.account?.displayText;
        if(!usersUsername)
        {
            UI.setStatus.failed("Failed to parse username, are you logged in?","stopped");
            return;
        }
        else
        {
            USER_EXCLUSIONS.push(usersUsername); // your username to the exclusions
        }
      

        if(SHOW_WARNING)
        {
            if(!confirm("MassBlocker is initialized and ready to initiate mass block.\n\nAre you sure you want to scrape and block every username shown on the document?"))
            {
                UI.setStatus.cancelled("User decided not to run","stopped");
                return;
            }
        }

        await createDatabases(); // create empty databases if they do not exist
        watchDatabase(); // watch for changes, start blocking users when changed

        const scrapeAndBlock = async () => {
            console.log("Scraping usernames...");

            const scrapedDatabaseName = databaseKeys.username.scraped;
            const blockedDatabaseName = databaseKeys.username.blocked

            const usernameElements = [
                Deobfuscator.obfuscateClass("authorLink"),
                Deobfuscator.obfuscateClass("commentAuthorLink")
            ];

            const scrapedUsernames = await scrapeUsernames(usernameElements); // scrape the usernames (from given DOM elements)
            await pushToDatabase(scrapedDatabaseName, scrapedUsernames);      // add the usernames to the database

            const scrapedDatabase = await loadFromDatabase(scrapedDatabaseName);
            const blockedDatabase = await loadFromDatabase(blockedDatabaseName);
            UI.setStatus.blocking(blockedDatabase.length, scrapedDatabase.length);
        };

        document.addEventListener('scroll', (() => {
            if(unsafeWindow.scrollY % 5 == 0)
            {
                scrapeAndBlock();
            }
        }));

        document.addEventListener("keydown", event => {
            event.stopPropagation();
            event.preventDefault();

            if(event.ctrlKey && event.keyCode == 66)
            {
                scrapeAndBlock();
            }
        });

        console.log("MassBlocker loaded!");
    };
})();
