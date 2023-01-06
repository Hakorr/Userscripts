// ==UserScript==
// @name        ChatGPT Everywhere
// @namespace   HKR
// @match       *://*/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      HKR
// @description ChatGPT right at your fingertips, everywhere, no matter the site.
// @grant       GM_xmlhttpRequest
// @run-at      document-load
// @homepageURL https://github.com/Hakorr/Userscripts/tree/main/OpenAI.com/ChatGPTEverywhere
// @require     https://github.com/AugmentedWeb/UserGui/raw/Release-1.0/usergui.js
// ==/UserScript==

(() => {
    /*//////////////////////////////////////////
    //////////// [SETTINGS SECTION] ////////////
    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
  
    // Get your API key here: https://beta.openai.com/account/api-keys
    const api_key = '';

    // Milliseconds of holding needed to open the GUI
    // Default: 1000 (1 second)
    const requiredHoldTimeMs = 1000;

    // Feel free to add your own types, styles and moods!

    const promptTypes = [
        'Message',
        'Announcement',
        'Email',
        'Welcome Email',
        'Goodbye Email',
        'Speech',
        'Comment',
        'Submission',
        'Letter',
        'Poem',
        'Review',
        'Newspaper report',
        'Novel',
        'Romance novel',
        'Dystopian novel'
    ];

    const promptStyles = [
        'Professional',
        'Sincere',
        'Kind',
        'Rude',
        'Descriptive',
        'Positive',
        'Negative',
        'Laid-back',
        'Thoughtful',
        'Philosophical',
        'Scientific',
        'Factual',
        'Lying',
        'Idiotic',
        'Propagandastic',
        'Opinionated',
        'Historical'
    ];

    const promptPositiveMoods = [
        'Happy',
        'Joyful',
        'Amused',
        'Blissful',
        'Calm',
        'Cheerful',
        'Content',
        'Dreamy',
        'Ecstatic',
        'Energetic',
        'Excited',
        'Flirty',
        'Giddy',
        'Loving',
        'Mellow',
        'Optimistic',
        'Peaceful',
        'Silly',
        'Sympathetic'
    ];

    const promptNegativeMoods = [
        'Sad',
        'Angry',
        'Annoyed',
        'Apathetic',
        'Cranky',
        'Depressed',
        'Envious',
        'Frustrated',
        'Gloomy',
        'Grumpy',
        'Guilty',
        'Indifferent',
        'Irritated',
        'Melancholy',
        'Pessimistic',
        'Rejected',
        'Restless',
        'Stressed',
        'Weird'
    ];

    // DO NOT ENTER ZONE - DO NOT PROCEED IF YOU DON'T KNOW WHAT YOU'RE DOING //
    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
    ////////////////////////////////////////////////////////////////////////////
    // DO NOT ENTER ZONE - DO NOT PROCEED IF YOU DON'T KNOW WHAT YOU'RE DOING //

    const api_endpoint = 'https://api.openai.com/v1/completions';

    const promptIgnoreStr = 'None';

    promptStyles.unshift(promptIgnoreStr);
    promptPositiveMoods.unshift(promptIgnoreStr);
    promptNegativeMoods.unshift(promptIgnoreStr);

    const Gui = new UserGui;
    Gui.settings.window.title = `${GM_info.script.name} v${GM_info.script.version}`; // set window title
    Gui.settings.window.centered = true;

    Gui.addPage("Main", `
    <div class="rendered-form">
        <div>
            <h2 access="false" id="control-4271313">Apply modifications</h2>
        </div>
        <div class="formbuilder-select form-group field-select-type">
            <label for="select-type" class="formbuilder-select-label">Type</label>
            <select class="form-control" name="select-type" id="select-type" required="required" aria-required="true">
            </select>
        </div>
        <div class="formbuilder-select form-group field-select-styles">
            <label for="select-styles" class="formbuilder-select-label">Styles</label>
            <select class="form-control" multiple="true" name="select-styles" id="select-styles" required="required" aria-required="true">
            </select>
        </div>
        <div>
            <p class="user-text-quote" style="font-style: italic; border-left: 3px solid rgb(188 188 188 / 50%); padding-left: 5px; color: rgb(0 0 0 / 50%);" access="false" id="control-7487193">loading...</p>
        </div>
        <div class="formbuilder-button form-group field-button-rewrite">
            <button type="button" class="btn-primary btn" name="button-rewrite" access="false" style="primary" id="button-rewrite">Rewrite</button>
        </div>
    </div>
    `);

    Gui.addPage('Moods', `
    <div class="rendered-form">
        <div class="formbuilder-select form-group field-select-positive-mood">
            <label for="select-positive-mood" class="formbuilder-select-label">Positive mood</label>
            <select class="form-control" multiple="true" name="select-positive-mood" id="select-positive-mood" aria-required="true">
            </select>
        </div>
        <div class="formbuilder-select form-group field-select-negative-mood">
            <label for="select-negative-mood" class="formbuilder-select-label">Negative mood</label>
            <select class="form-control" multiple="true" name="select-negative-mood" id="select-negative-mood" aria-required="true">
            </select>
        </div>
        <small style="font-style: italic;" access="false">Hint: You can select multiple items by holding down the CTRL key!</small>
    </div>
    `);

    Gui.addPage('Info', `
    <div class="rendered-form">
        <h6 access="false">Repository</h6>
        <a href="https://github.com/Hakorr/Userscripts/tree/main/OpenAI.com/ChatGPTEverywhere" target="_blank">Userscripts/ChatGPTEverywhere</a>
        <hr>
        <h6 access="false">Found a bug?</h6>
        <a href="https://github.com/Hakorr/Userscripts/issues" target="_blank">Make an issue</a>
        <br>
        <small>(Mention this userscript on your report)</small>
        <hr>
        <h6 access="false">GUI Repository</h6>
        <a href="https://github.com/AugmentedWeb/UserGui" target="_blank">UserGui</a>
        <hr>
        <small>Made by <a href="https://github.com/Hakorr" target="_blank">Hakorr</a> with 💙</small>
    </div>
    `);

    function cleanPromptData(data) {
        if(typeof data == 'object') {
            data = data.map(d => d.toLowerCase());
            data = data.filter(d => d != promptIgnoreStr.toLowerCase());

            return data;
        } else {
            return data.toLowerCase().replace(promptIgnoreStr.toLowerCase(), '');
        }
    }

    function createPromptStr(data) {
        if(typeof data == 'object') {
            cleanPromptData(data);

            const lastItem = cleanPromptData(data.pop());

            return `${data.join(', ')} and ${lastItem}`;
        } else {
            return cleanPromptData(data);
        }
    }

    function getPrompt(type, styles, positiveMoods, negativeMoods, prompt) {
        const typeStr = cleanPromptData(type);

        styles = cleanPromptData(styles);
        const styleStr = styles.length > 0 ? ` Write it in a ${createPromptStr(styles)} style.` : '';

        positiveMoods = cleanPromptData(positiveMoods);
        const positiveMoodStr = positiveMoods.length > 0 ? ` Be ${createPromptStr(positiveMoods)}.` : '';

        negativeMoods = cleanPromptData(negativeMoods);
        const negativeMoodStr = negativeMoods.length > 0 ? ` Be ${createPromptStr(negativeMoods)}.` : '';

        return `Rewrite the text after the semicolons as a ${typeStr}.${styleStr + positiveMoodStr + negativeMoodStr} ; ${prompt}`;
    };

    function createDataObj(s, c, d) {
        return { 'success': s, 'code': c, 'data': d };
    }

    function removeBeginning(str) {
        while(true) {
            if([' ', '\n'].includes(str.slice(0, 1))) {
                str = str.slice(1);
            } else {
                return str;
            }
        }
    }

    async function postPromptRequest(prompt) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'POST', url: api_endpoint, headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api_key}`
                },
                data: JSON.stringify({
                    'model': 'text-davinci-003',
                    'prompt': prompt,
                    'max_tokens': 4000,
                    'temperature': 1.0
                }),
                onload: res => {
                    try {
                        const resObj = JSON.parse(res.response);

                        if(res.status == 200) {
                            resolve(createDataObj(true, res.status, removeBeginning(resObj.choices[0].text)));
                        } else {
                            resolve(createDataObj(false, res.status, resObj.error.message));
                        }
                    } catch(err) {
                        resolve(createDataObj(false, res.status, err.message));
                    }
                },
                onerror: err => {
                    resolve(createDataObj(false, res.status, 'Something went wrong with API request.'));
                }
            });
        });
    }

    async function postPrompt(prompt) {
        //console.log(`[${GM_info.script.name}] Sending the prompt request: %c"${prompt}"`, 'color: #217de0');

        const resObj = await postPromptRequest(prompt);

        if(resObj.success) {
            return resObj.data;
        } else {
            alert(`[${GM_info.script.name} Error] ${resObj.data}`);
        }

        return null;
    }

    function updateElem(elem) {
        elem.dispatchEvent(new Event('change', {
            view: window,
            bubbles: true,
            cancelable: true
        }));

        elem.dispatchEvent(new Event('input', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }

    function replaceElemText(elem, text, newText) {
        if(elem?.innerText?.includes(text)) {
            //console.table({ 'Change Type': 'innerText', 'Replaced Text': text, 'New Text': newText });

            elem.innerText = elem.innerText.replace(text, newText);

            updateElem(elem);

            return true;
        } else if(elem?.value?.includes(text)) {
            //console.table({ 'Change Type': 'value', 'Replaced Text': text, 'New Text': newText });

            elem.value = elem.value.replace(text, newText);

            updateElem(elem);

            return true;
        }

        return false;
    }

    function replaceSelectionText(suitableSelectionElem, text, newText) {
        try {
            if(suitableSelectionElem?.querySelector) {
                const replaced = replaceElemText(suitableSelectionElem, text, newText);

                if(!replaced) {
                    const children = [...suitableSelectionElem.querySelectorAll('*')];

                    for(const i in children) {
                        const replaced = replaceElemText(children[i], text, newText);

                        if(replaced) return true;
                    }
                } else {
                    return true;
                }
            }

            alert(`[${GM_info.script.name} Common Error] Couldn't find the right text element on the page!`);
        } catch(err) {
            alert(`[${GM_info.script.name} Common Error] This site is most likely not supported, error while trying to find the text element! (${err.message})`);
        }

        return false;
    }

    function createOption(id, value, i) {
        const option = document.createElement('option');
            option.value = value;
            option.id = id;
            option.innerText = value;

        if(i == 0) {
            option.setAttribute('selected', 'true');
        }

        return option;
    }

    function findSuitableSelectionElement(selectionElem) {
        const attemptsToFindSuitableElem = 5;

        for(let i = 0; i < attemptsToFindSuitableElem; i++) {
            if(selectionElem?.querySelector) {
                break;
            } else if(selectionElem?.parentElement) {
                selectionElem = selectionElem.parentElement;
            }
        }

        return selectionElem;
    }

    let mouseHoldTimeout = null;
    let currentGuiDocument = null;

    function openGui() {
        if(document.getSelection()) {
            const selectionElem = findSuitableSelectionElement(document.getSelection().baseNode);
            let selectionText = document.getSelection().toString();

            let originalSelection = selectionText;

            if(selectionElem && selectionText.length > 0) {
                if(currentGuiDocument) {
                    Gui.close();
                }

                Gui.open(async () => {
                    currentGuiDocument = Gui.document;

                    const textQuote = Gui.document.querySelector('.user-text-quote');
                        textQuote.innerText = selectionText;

                    const typeSelect = Gui.document.querySelector('#select-type');

                    promptTypes.forEach((mood, i) => {
                        const optionElem = createOption(`select-type-${i}`, mood, i);

                        typeSelect.appendChild(optionElem);
                    });

                    const styleSelect = Gui.document.querySelector('#select-styles');

                    promptStyles.forEach((mood, i) => {
                        const optionElem = createOption(`select-styles-${i}`, mood, i);

                        styleSelect.appendChild(optionElem);
                    });

                    const positiveMoodSelect = Gui.document.querySelector('#select-positive-mood');

                    promptPositiveMoods.forEach((mood, i) => {
                        const optionElem = createOption(`select-positive-mood-${i}`, mood, i);

                        positiveMoodSelect.appendChild(optionElem);
                    });

                    const negativeMoodSelect = Gui.document.querySelector('#select-negative-mood');

                    promptNegativeMoods.forEach((mood, i) => {
                        const optionElem = createOption(`select-negative-mood-${i}`, mood, i);

                        negativeMoodSelect.appendChild(optionElem);
                    });

                    const rewriteBtn = Gui.document.querySelector('#button-rewrite');
                        rewriteBtn.onclick = async () => {
                            if(rewriteBtn.innerText == 'Revert') {
                                const replaced = replaceSelectionText(selectionElem, selectionText, originalSelection);

                                if(replaced) {
                                    selectionText = originalSelection;
                                    textQuote.innerText = originalSelection;
                                    rewriteBtn.innerText = 'Rewrite';
                                    rewriteBtn.classList.toggle('btn-warning');
                                }
                            } else {
                                const type = Gui.getData('select-type');
                                const styles = Gui.getData('select-styles');
                                const positiveMoods = Gui.getData('select-positive-mood');
                                const negativeMoods = Gui.getData('select-negative-mood');

                                const customPrompt = getPrompt(type, styles, positiveMoods, negativeMoods, selectionText);

                                const waitAnimation = setInterval(() => {
                                    rewriteBtn.innerText = `Writing... ${rewriteBtn.innerText.includes('/') ? '\\' : '/'}`;
                                }, 100);

                                const gptWrittenVersion = await postPrompt(customPrompt);

                                clearInterval(waitAnimation);

                                rewriteBtn.innerText = 'Revert';
                                rewriteBtn.classList.toggle('btn-warning');

                                if(gptWrittenVersion) {
                                    const replaced = replaceSelectionText(selectionElem, selectionText, gptWrittenVersion);

                                    if(replaced) {
                                        textQuote.innerText = gptWrittenVersion;
                                        selectionText = gptWrittenVersion;
                                    }
                                }
                            }
                        };
                });
            }
        } else {
            alert(`[${GM_info.script.name} Error] Please use a modern or up-to-date browser. Your browser is not supported.`);
        }
    }

    // Hold for x amount of milliseconds for the GUI to open
    document.addEventListener('mousedown', e => clearTimeout(mouseHoldTimeout));
    document.addEventListener('mouseup', e => clearTimeout(mouseHoldTimeout));
    document.addEventListener('selectionchange', e => {
        clearTimeout(mouseHoldTimeout);
        mouseHoldTimeout = setTimeout(openGui, requiredHoldTimeMs);
    });
})();
