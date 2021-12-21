// ==UserScript==
// @name        [Reddit] Modmail++
// @namespace   HKR
// @match       https://mod.reddit.com/mail/*
// @grant       none
// @version     2.6
// @author      HKR
// @description Additional tools and information to Reddit's Modmail
// @icon        https://www.redditstatic.com/modmail/favicon/favicon-32x32.png
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// @require     https://cdn.jsdelivr.net/npm/party-js@2.1.2/bundle/party.js
// ==/UserScript==

function main() { console.log("[Modmail++] %cMain function ran!", "color: grey");
	/* ---------- SETTINGS ---------- */

	//Variables for the responses
	const subTag = $(".ThreadTitle__community").href.slice(23); //Format r/subreddit
	const userTag = "u/" + $(".InfoBar__username").innerText; //Format u/username
	const modmail = `[modmail](https://www.reddit.com/message/compose?to=/${keepPrefix(subTag,true)})`;
	const rules = `https://www.reddit.com/${keepPrefix(subTag,true)}/about/rules`;

	//Text color settings
	var textColor = null, lightModeTextColor = "#6e6e6e", darkModeTextColor = "#757575";

	//Title color settings
	var titleColor = null, lightModeTitleColor = "#2c2c2c", darkModeTitleColor = "#a7a7a7";

	//Listbox color settings
	var listBoxColor = null, lightModeListColor = "#fff", darkModeListColor = "#242424";

	//Data (Such as numbers) color settings
	const dataColor = "#0079d3";

	//No response list is created if false
	const enableCustomResponses = true;

	//No chat profile icons are added if false
	const chatProfileIcons = true;

	const placeholderMessage = randItem([
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

	/* Responses - Edit to your own liking, remove whatever you don't like!
	- name | The name of the response that will show on the listbox. (Example value: "Hello!")
	- replace | Replace all messagebox text if true, otherwise just add. (Example value: true)
	- subreddit | Visible only while on this subreddit's modmail. (Example value: "r/subreddit") 
	- content | This text will be added to the messagebox once selected (Example value: "Hello world!")*/
	const responses = [
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
			"content":`Your post broke our [rules](${rules}).\n\nThe action will not be reverted.`
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
			"content":`${randItem(["Greetings","Hello","Hi"])} ${userTag},\n\n`
		},
		{
			"name":"Add Subreddit Mention",
			"replace":false,
			"subreddit":"",
			"content":`${subTag}`
		},
		{
			"name":"Add User Mention",
			"replace":false,
			"subreddit":"",
			"content":`${userTag}`
		},
		{
			"name":"Add Modmail Link",
			"replace":false,
			"subreddit":"",
			"content":`${modmail}`
		},
		{
			"name":"Add Karma Link",
			"replace":false,
			"subreddit":"",
			"content":`[karma](https://reddit.zendesk.com/hc/en-us/articles/204511829-What-is-karma-)`
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
			"content":`[Admins](https://old.reddit.com/message/compose?to=%2Fr%2Freddit.com)`
		},
		{
			"name":"Add Rickroll",
			"replace":false,
			"subreddit":"",
			"content":`[link](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`
		}
	];

	/* ---------- SETTINGS END ---------- */

	/* ---------- JAVASCRIPT & HTML ---------- */

	function time(UNIX_timestamp) {
		//Get UNIX time
		var d = new Date(UNIX_timestamp * 1000);
		const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

		//Get year, month, date, hour, min & sec variables
		var year = d.getFullYear(), 
		monthNum = d.getMonth() + 1,
		month = months[d.getMonth()],
		date = d.getDate(), 
		hour = fixnumber(d.getHours()), 
		min = fixnumber(d.getMinutes()), 
		sec = fixnumber(d.getSeconds());

		//Construct the time (DD/MM/YY HH/MM/SS) and return it
		var time = `${date}.${monthNum}.${year} ${hour}:${min}:${sec}`;
		return time;
	}
	
	//Function to avoid XSS
	function sanitize(evilstring) {
		const decoder = document.createElement('div')
		decoder.innerHTML = evilstring;
		return decoder.textContent;
	}

	//Appends the info (main, karma, links) to the page
	function addInfo() {
		//Load and parse username
		var username = removePrefix($(".InfoBar__username").innerText);
		var about = `https://www.reddit.com/user/${username}/about.json`;
		const xhr = new XMLHttpRequest();
	
		//Once the user info JSON has been fetched
		xhr.onload = () => {
			var user = JSON.parse(xhr.responseText);
			//Separator HTML element
			var seperator = document.createElement('div');
			seperator.innerHTML = '<div class="InfoBar__modActions"></div>';
	
			//HTML element that contains all the data
			var userDetails = document.createElement('div');
			userDetails.classList.add("InfoBar__age");
			userDetails.innerHTML = `<img class="profileIcon" src="${user.data.icon_img}" width="25">
			<a class="InfoBar__username" href="https://www.reddit.com/user/${user.data.name}">${removePrefix(user.data.subreddit.display_name_prefixed)}</a>
			<h1 style="color: ${textColor} ; font-size: 11px; margin-top: 17px; margin-bottom: 10px;">${sanitize(user.data.subreddit.public_description)}</h1>
			<h1 class="dataTitle">Main</h1>
			<div class="dataText">
				<p>Created: <span class="value">${time(user.data.created)}</span></p>
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
			</div>`;

			//Add profile pictures
			if(chatProfileIcons) {
				//Icon element
				var chatProfileIcon = document.createElement('div');
				chatProfileIcon.innerHTML = `<img class="chatProfileIcon" src="${user.data.icon_img}" width="25">`;

				//Loop trough every username on chat
				for(var i = 0; i < $$(".ThreadPreview__author").length; i++) {
					//Get username (u/xxxxxx)
					let name = $$(".Author__text")[i].innerText;
					//Check if there is an icon appended already
					let exists = $$(".ThreadPreview__author")[i].childNodes.length == 1 ? false : true;
					//If the username is the user (non-mod)
					if(removePrefix(name) == username && !exists) {
						//Append the icon next to the username -> [icon] u/username
						$$(".ThreadPreview__author")[i].insertBefore(chatProfileIcon.cloneNode(true), $$(".ThreadPreview__author")[i].firstChild);
					}
				}
			}
			
			//Append the elements
			$(".ThreadViewer__infobar").appendChild(seperator);
			$(".ThreadViewer__infobar").appendChild(seperator);
			$(".ThreadViewer__infobar").appendChild(userDetails);
			$(".ThreadViewer__infobar").appendChild($(".ThreadViewer__infobar").firstChild);
			$(".InfoBar").appendChild($(".InfoBar__modActions"));
			$(".InfoBar").insertBefore($(".InfoBar__modActions"),$(".InfoBar").firstChild);
			if($(".InfoBar__banText"))
				$(".ThreadViewer__infobar").insertBefore($(".InfoBar__banText"),$(".ThreadViewer__infobar").firstChild);
			
			//Remove certain elements
			$$(".InfoBar__username")[1].outerHTML = "";
			$$(".InfoBar__age")[1].outerHTML = "";
			$$(".InfoBar__modActions")[1].outerHTML = "";
		};
		
		//Get user details
		xhr.open('GET', about);
		xhr.send();
	}

    function makeListValue(name,description) {
    let encodedName = btoa(name);
    let encodedDesc = btoa(description);
        return `<div class="listValue" value='${encodedDesc}'><input onclick="selected(this)" name="subredditRule" type="radio" id='${encodedName}' value='${encodedName}' ><label for='${encodedName}'>${name}</label></div>`
    }

	//Appends the response template listbox to the page
	function addResponseBox() {
		//Hide real textarea and append a new one (so the text won't get removed by the sync feature)
		$(".ThreadViewerReplyForm__replyText").style.cssText += 'display: none';
		const txtArea = document.createElement("textarea");
		txtArea.setAttribute('class', 'Textarea ThreadViewerReplyForm__replyText ');
		txtArea.setAttribute('id', 'realTextarea');
		txtArea.setAttribute('name', 'body');
		txtArea.setAttribute('placeholder', `${placeholderMessage}`);
		$(".ThreadViewerReplyForm").insertBefore(txtArea,$(".ThreadViewerReplyForm__replyFooter"));
			
		//Fix clear textarea - will not clear it if the moderator stays to send another message
		var replyButton = $(".ThreadViewerReplyForm__replyButton")
		const clearBoxJS = `setTimeout(function(){document.getElementById("realTextarea").value = ""; console.log("[Modmail++] Cleared the textarea!");},500)`;
		replyButton.setAttribute("onclick", clearBoxJS);

		//Listbox element
		var responseBox = document.createElement('div');
		responseBox.classList.add("select");
		responseBox.innerHTML = `<h2 class="dataTitle">Response Templates</h2>
		<select id="responseListbox" onchange="listBoxChanged(this.value);" onfocus="this.selectedIndex = -1;"/>
        <option selected disabled hidden>Select a template</option>
		<span class="focus"></span>`;

		const xhr = new XMLHttpRequest();
		const ruleJSON = rules + ".json";

		//Once the user info JSON has been fetched
		xhr.onload = () => {
			try {
				$$(".subredditRuleList").forEach(elem => elem.remove());
				let json = JSON.parse(xhr.responseText);
				let listContent = "";
				for(let i = 0; i < json.rules.length; i++) {
					listContent += makeListValue(json.rules[i].short_name,json.rules[i].description);
				}
	
				var ruleList = document.createElement('div');
				ruleList.classList.add("subredditRuleList");
				ruleList.innerHTML = `<div class="ruleDiv" style="background-color: rgba(26, 26, 27, 0.6); visibility: hidden">
					<div aria-modal="true" class="dialogWindow" role="dialog" tabindex="-1">
						<div class="listWindow">
							<div class="ruleList">
								<div class="ruleHeader">Select a rule<svg onclick="closeIconClicked()" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="closeIconSVG"><polygon fill="inherit" points="11.649 9.882 18.262 3.267 16.495 1.5 9.881 8.114 3.267 1.5 1.5 3.267 8.114 9.883 1.5 16.497 3.267 18.264 9.881 11.65 16.495 18.264 18.262 16.497"></polygon></svg></div>
								<fieldset class="fieldSet">
									<div class="title"><span>Which community rule did the user violate?</span></div>
									<div class="listBox">
										${listContent}
									</div>
									<div class="infoIcon"><svg class="infoIconSVG" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g><path d="M10,8.5 C10.553,8.5 11,8.948 11,9.5 L11,13.5 C11,14.052 10.553,14.5 10,14.5 C9.447,14.5 9,14.052 9,13.5 L9,9.5 C9,8.948 9.447,8.5 10,8.5 Z M10.7002,5.79 C10.8012,5.89 10.8702,6 10.9212,6.12 C10.9712,6.24 11.0002,6.37 11.0002,6.5 C11.0002,6.57 10.9902,6.63 10.9802,6.7 C10.9712,6.76 10.9502,6.82 10.9212,6.88 C10.9002,6.94 10.8702,7 10.8302,7.05 C10.7902,7.11 10.7502,7.16 10.7002,7.21 C10.6602,7.25 10.6102,7.29 10.5512,7.33 C10.5002,7.37 10.4402,7.4 10.3812,7.42 C10.3202,7.45 10.2612,7.47 10.1902,7.48 C10.1312,7.49 10.0602,7.5 10.0002,7.5 C9.7402,7.5 9.4802,7.39 9.2902,7.21 C9.1102,7.02 9.0002,6.77 9.0002,6.5 C9.0002,6.37 9.0302,6.24 9.0802,6.12 C9.1312,5.99 9.2002,5.89 9.2902,5.79 C9.5202,5.56 9.8702,5.46 10.1902,5.52 C10.2612,5.53 10.3202,5.55 10.3812,5.58 C10.4402,5.6 10.5002,5.63 10.5512,5.67 C10.6102,5.71 10.6602,5.75 10.7002,5.79 Z M10,16 C6.691,16 4,13.309 4,10 C4,6.691 6.691,4 10,4 C13.309,4 16,6.691 16,10 C16,13.309 13.309,16 10,16 M10,2 C5.589,2 2,5.589 2,10 C2,14.411 5.589,18 10,18 C14.411,18 18,14.411 18,10 C18,5.589 14.411,2 10,2"></path></g></svg>
										<div class="infoBox">
											<p><span>Not sure? </span><a href="https://www.reddit.com/${keepPrefix(subTag)}/about/rules" target="_blank" rel="noopener noreferrer">Read ${subTag}'s rules</a></p>
										</div>
									</div>
									<footer class="bottomFooter"><button type="button" disabled="" onclick="selectButtonClicked()" class="selectButton">Select</button></footer>
								</fieldset>
							</div>
						</div>
					</div>
				</div>`;

				$("body").appendChild(ruleList);
				
			} catch(e) {
				console.log("[Modmail++] %cFailed to load subreddit rules, possibly a private subreddit?", "color: red");
			}
		};

		//Get subreddit's rules
		xhr.open('GET', ruleJSON);
		xhr.send();

		//Script element to head
		var headJS = document.createElement('script');
        headJS.innerHTML = `
        var responses = ${JSON.stringify(responses)};
        var ruleListActivator = "<open-rulelist-dialog>";
        function listBoxChanged(message) {
        if(message == ruleListActivator) {
            let ruleDiv = document.getElementsByClassName("ruleDiv")[0];
            ruleDiv.style.visibility = "visible";
        } else {
            var messageBox = document.getElementById("realTextarea");
            var response = responses.find(x => x.content == message);
            response.replace ? messageBox.value = message : messageBox.value += message;
            console.log("[Modmail++] Updated the message: %c" + messageBox.value,"color: orange");
        }
        }
        //Implement listbox select highlight
        function selected(element){
            let selectColor = "#79797959";
            let selectedElem = document.getElementById("currentlySelected");
            //If an elem already selected, reset the id and set its background color to nothing
            if(selectedElem) { selectedElem.style.backgroundColor = ""; selectedElem.id = ""; }

            element.parentElement.style.backgroundColor = selectColor;
            element.parentElement.id = "currentlySelected";
            document.getElementsByClassName("selectButton")[0].disabled = false;
        }
        const removeBreaks = text => text.replace(/(\\r\\n|\\n|\\r)/gm, "");
        function selectButtonClicked() {
            let selectedElem = document.getElementById("currentlySelected");
            let messageBox = document.getElementById("realTextarea");
            if(selectedElem) {
                let fixedDescription = atob(selectedElem.getAttribute('value')).replaceAll("\\n","\\n> ") + '\\n\\n';
                let message = \`> [**\${selectedElem.children[1].textContent}**]\\n>\\n> \${fixedDescription}\`;
                let response = responses.find(x => x.content == ruleListActivator);
                response.replace ? messageBox.value = message : messageBox.value += message;
                console.log("[Modmail++] New messageBox value: %c" + messageBox.value,"color: orange");
                closeIconClicked();
            }
        }
        function closeIconClicked() {
        let ruleDiv = document.getElementsByClassName("ruleDiv")[0];
        ruleDiv.style.visibility = "hidden";
        }`;
	
		//Add all the responses to the listbox
		function populate() {
			var select = $("#responseListbox");
			for(var i = 0; i < responses.length; i++) {
				//Sorry if it looks a bit complicated
				if(keepPrefix(responses[i].subreddit.toLowerCase(), true) == keepPrefix(subTag.toLowerCase(), true) || responses[i].subreddit == "") 
				select.options[select.options.length] = new Option(responses[i].name, responses[i].content);
			}
		}
	
		$(".ThreadViewer__replyContainer").prepend(responseBox);
		var head = $("head");
		head.appendChild(headJS);

		$(".ThreadViewer__replyContainer").insertBefore($(".ThreadViewer__typingIndicator"),$(".select"));
	
		populate();
	}

	//Detects the current theme (dark/light) and applies the correct color (for the added elements)
	function themeColors() {
		var darkTheme = $$(".theme-dark").length ? true : false;
		if(darkTheme) {
			console.log("[Modmail++] Dark mode detected! Setting colors...");
			textColor = darkModeTextColor;
			titleColor = darkModeTitleColor;
			listBoxColor = darkModeListColor;
		} else {
			console.log("[Modmail++] Light mode detected! Setting colors...");
			textColor = lightModeTextColor;
			titleColor = lightModeTitleColor;
			listBoxColor = lightModeListColor;
		}
	}

	themeColors();

	//Took advice for the listbox CSS from moderncss.dev/custom-select-styles-with-pure-css, thanks!
	var css = `.profileIcon:hover {
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
		color: ${dataColor};
	}
	.InfoBar__banText {
		padding-bottom: 15px;
	}
	.InfoBar__username, .InfoBar__username:visited {
		padding-left: 10px;
	}
	.ThreadViewer__infobarContainer {
		display: table;
	}
	.dataText {
		color: ${textColor}; 
		font-size: 13px;
		padding-left: 10px;
	}
	.dataTitle {
		color: ${titleColor};
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
		background-color: ${listBoxColor};
		color: ${textColor};
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
		background-color: ${listBoxColor};
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
	  background: ${listBoxColor}; 
	}
	::-webkit-scrollbar-thumb {
	  background: #888; 
	}
	::-webkit-scrollbar-thumb:hover {
	  background: #555;
	}
	.subredditRuleList {
		--newRedditTheme-bodyText: ${titleColor};
		--newRedditTheme-metaText: ${textColor};
		--newRedditTheme-navIconFaded10: rgba(215,218,220,0.1);
		--newRedditTheme-actionIconTinted80: #9a9b9c;
		--newRedditTheme-activeShaded90: #006cbd;
		--newRedditTheme-actionIconAlpha20: rgba(129,131,132,0.2);
		--newCommunityTheme-actionIcon: #818384;
		--newRedditTheme-bodyTextAlpha03: ${listBoxColor};
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
		color: ${titleColor};
	}
	.StyledHtml td {
		color: ${textColor};
	}`;

	//Apply the custom css
	var styleSheet = document.createElement("style");
	styleSheet.type = "text/css";
	styleSheet.innerText = css;
	document.head.appendChild(styleSheet);

	addInfo();
	if(enableCustomResponses && $("#responseListbox") == null) addResponseBox();
	console.log("[Modmail++] %cLoaded!", "color: lime");

} /* End of Main function */

console.log("[Modmail++] %cScript started!", "color: green");

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//Returns a random item from array
const randItem = itemArr => itemArr[Math.floor(Math.random() * itemArr.length)];

//Adds a zero suffix if x < 10
const fixnumber = number => number < 10 ? "0" + number : number;

//Removes the Reddit prefix
const removePrefix = username => ["r/","u/"].some(tag => username.includes(tag)) ? username.slice(2) : username;

//Adds the Reddit prefix if nonexistant
const keepPrefix = (username, subreddit) => ["r/","u/"].some(tag => username.includes(tag)) ? username : subreddit ? `r/${username}` : `u/${username}`;

$(".Sidebar__titleMessage").setAttribute("onclick","window.open('https://github.com/Hakorr/Userscripts/tree/main/Reddit.com/ModmailExtraInfo')");
$(".Sidebar__titleMessage").setAttribute("style","cursor: pointer");
$(".Sidebar__titleMessage").innerText = "Modmail++";

var run = true;

/* Start Main function when visiting new modmail */
var pageURLCheckTimer = setInterval (function () {
    if (this.lastPathStr !== location.pathname) 
    {
        this.lastPathStr = location.pathname;

		console.log("[Modmail++] %cNew page detected!", "color: gold")
		run = true;

		let interval = setInterval (function () {
		//Add confetti explosion if no mail
		if($(".NoThreadMessage__generic") && run) {
			clearInterval(interval);
			run = false;
			console.log("[Modmail++] %cNo modmail!", "color: lime");
			party.confetti($(".NoThreadMessage__generic"), {
				count: party.variation.range(20, 40),
				spread: 50
			});
		}

		//User is on modmail "chat" page
		if($(".InfoBar__username")&& run) {
			clearInterval(interval);
			run = false;
			if($("body")) main();
		}
		}, 5);
    }
}, 100);
