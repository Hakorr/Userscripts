// ==UserScript==
// @name        [Reddit] AttributeDeobfuscator
// @namespace   HKR
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.0
// @author      HKR
// @run-at      document-start
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// @description Gives the ability to turn the original attribute names into the obfuscated/randomized ones and vice versa.
// ==/UserScript==

/*////////////////////////////////////////////////////////
                    - Your own code -
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// This function does not refresh if the page changes!
// Add a listener if you want to do that.
function yourFunction() {
    //This log can help you find your values
    //console.log(deobfuscator_values.valueArr);
  
    //An example use case for the deobfuscator
    //This changes the main page's (the feed) "Create post" text to "Hack the world";
    let deobfus_example = deobfuscator_utils.toObfuscated("Input", true);
    deobfus_example[0].placeholder = "Hack the world";
    deobfus_example[0].style.border = "1px solid #ff0000";
}

/*////////////////////////////////////////////////////////
        - Attribute Deobfuscator's source code -
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

const deobfuscator_main = () => yourFunction();

const deobfuscator_values = {
    valueArr: []
};

const deobfuscator_utils = {
    toObfuscated: (str, returnAsElementArray) => {
        let result = deobfuscator_values.valueArr.find(val => val.name == str);
        if(typeof result == "object") 
        {
            if(returnAsElementArray)
            {
                return document.querySelectorAll('.' + result.randomizedName);
            }
            else
            {
                return result.randomizedName;
            }
        }
    },
    toNormal: str => {
        let result = deobfuscator_values.valueArr.find(val => val.randomizedName == str)
        if(typeof result == "object")
        {
            return result.name;
        }
    }
};

(() => {
    async function Get(url) {
        let response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let text = await response.text();
        return text;
    }

    /* onbeforescriptexecute -> https://github.com/Ray-Adams/beforeScriptExecute-Polyfill */
    const rndName = Math.random().toString(36).substring(2, Math.floor(Math.random() * 40) + 5);

    (() => {
        'use strict';

        const BseEvent = new Event(rndName, {
            bubbles: true,
            cancelable: true
        });

        const observerCallback = (mutationsList) => {
            for (let mutationRecord of mutationsList) {
                for (let node of mutationRecord.addedNodes) {
                    if (node.tagName !== 'SCRIPT') continue;

                    // Adds functionality to document.onbeforescriptexecute
                    if (typeof document.rndName === 'function') {
                        document.addEventListener(
                            rndName,
                            document.rndName,
                            { once: true }
                        );
                    };

                    // Returns false if preventDefault() was called
                    if (!node.dispatchEvent(BseEvent)) {
                        node.remove();
                    };
                };
            };
        };

        const mutObvsr = new MutationObserver(observerCallback);
        mutObvsr.observe(document, { childList: true, subtree: true });
    })();
  
    const handleScript = str => {
        //This could be done with a fancy Regex search, but I don't have a sufficent Regex knowledge to make to fast enough.

        if(str.includes("sourceMapping"))
        {
            let strArr = str.split("},");

            strArr.forEach(x => {
                if(x.includes("e.exports={")) 
                {
                    x = x.match(new RegExp(`e.exports={` + "(.*)" + `}`)); //match in the middle of two strings

                    if(x && x.length > 1) //more than two results
                    { 
                        x = x[1]; //take the second result

                        x = x.replaceAll(' ',''); //clear spaces
                        x = x.replaceAll('\n',''); //clear newlines

                        // A scuffed way to add quotation marks around the key values to make the string a valid JSON string
                        // {name:"key"} -> {"name":"key"}
                        x = `{${x}}`; //place curly brackets around the string
                        x = x.replaceAll('{','{"'); //add a quotation mark to the right side of every right-facing curly bracket
                        x = x.replaceAll(',',',"'); //add a comma to the left side of every quotation mark
                        x = x.replaceAll(':','":'); //add a quotation mark to the left side of every colon
                        x = x.replaceAll('""','"'); //replace double quotation marks with a single one

                        try 
                        {
                            let parsed = JSON.parse(x);

                            if(Object.keys(parsed).length > 0) //if parsed successfully
                            {
                                for(let i = 0; i < Object.keys(parsed).length; i++)
                                {
                                    let value = Object.entries(parsed)[i];
                                    let regularName = value[0];
                                    let randomizedName = value[1];
                                    let combinedObj = { 
                                      "name": regularName,
                                      "randomizedName": randomizedName
                                    };

                                    if(!deobfuscator_values.valueArr.some(val => val.randomizedName == combinedObj.randomizedName)) //if doesn't already exist
                                    {
                                      deobfuscator_values.valueArr.push(combinedObj); //add the obj to the array
                                    }
                                }
                            }
                        }
                        catch(e)
                        {
                            //console.log(`Script handling error: ${e}`)
                        }
                    }
                }
            });
        }
    }

    let scriptURLs = [];

    document.rndName = async (e) => {
        if(e.target.src.includes(".js"))
        {
            if(!scriptURLs.includes(e.target.src)) //if the URL is a new one (this is to prevent the same script loading twice)
            {
                scriptURLs.push(e.target.src); //add the URL to an array of already processed URLs

                let resultStr = await Get(e.target.src); //get http request the script
                handleScript(resultStr); //once we have the script, handle it (extract values)
            }
        }
    }

    window.addEventListener("load", () => deobfuscator_main());
})();
