// ==UserScript==
// @name        [Reddit] Modmail++
// @namespace   HKR
// @match       https://mod.reddit.com/mail/*
// @grant       none
// @version     2.0
// @author      HKR
// @description Additional tools and information to Reddit's Modmail
// @icon        https://www.redditstatic.com/modmail/favicon/favicon-32x32.png
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// ==/UserScript==

console.log("[ModmailExtraInfo] %cScript started!", "color: green");

/* Do not touch */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
var first = false;
/* Do not touch */

function main() {
	console.log("[ModmailExtraInfo] %cMain function ran!", "color: grey");

	/* SETTINGS */

	/* NOTE (If you want to use the Custom Responses): Reddit's sync feature removes the script's added text.
	- If you block "https://oauth.reddit.com/api/mod/conversations/*****?markRead=false&redditWebClient=modmail", the added text will stay. */

	//Variables for the responses
	const subTag = $(".ThreadTitle__community").href.slice(23);
	const userTag = "u/" + $(".InfoBar__username").innerText;
	const modmail = `[modmail](https://www.reddit.com/message/compose?to=/${subTag})`;
	const rules = `https://www.reddit.com/${subTag}/about/rules`;
	const randItem = itemArr => itemArr[Math.floor(Math.random() * itemArr.length)];

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

	//Feel free to edit and add more responses suitable for you! Replace means if to replace all text or just to add the text.
	const responses = [
		{
			"name":"Select a template",
			"replace":true,
			"content":``
		},
		{
			"name":"Default approved",
			"replace":true,
			"content":`Hey, approved the post!`
		},
		{
			"name":"Default rule broken",
			"replace":true,
			"content":`Your post broke our [rules](${rules}).\n\nThe action will not be reverted.`
		},
		{
			"name":"Add greetings",
			"replace":true,
			"content":`${randItem(["Greetings","Hello","Hi"])} ${userTag},\n\n`
		},
		{
			"name":"Add thanks",
			"replace":false,
			"content":`\n\nThank you!`
		},
		{
			"name":"Add subreddit mention",
			"replace":false,
			"content":`${subTag}`
		},
		{
			"name":"Add user mention",
			"replace":false,
			"content":`${userTag}`
		},
		{
			"name":"Add Modmail link",
			"replace":false,
			"content":`${modmail}`
		},
		{
			"name":"Add Content Policy",
			"replace":false,
			"content":`[Content Policy](https://www.redditinc.com/policies/content-policy)`
		},
		{
			"name":"Add User Agreement",
			"replace":false,
			"content":`[User Agreement](https://www.redditinc.com/policies/user-agreement)`
		},
		{
			"name":"Add Rickroll",
			"replace":false,
			"content":`[link](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`
		}
	];

	/* ---------- JS & HTML ---------- */
	
	function time(UNIX_timestamp){
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
	
	//Adds a zero suffix if x < 10
	const fixnumber = number => number < 10 ? "0" + number : number;

	//Removes the u/ prefix
	const removePrefix = username => username.includes("u/") ? username.slice(2) : username;

	//Adds the u/ prefix if nonexistant
	const keepPrefix = username => username.includes("u/") ? username : "u/" + username;

	//Function to avoid XSS
	function sanitize(evilstring) {
		const decoder = document.createElement('div')
		decoder.innerHTML = evilstring;
		return decoder.textContent;
	}

	//Appends the info (main, karma, links) to the page
	function addInfo(){
		//Load and parse username
		var username = removePrefix($(".InfoBar__username").innerText);
		var about = "https://www.reddit.com/user/" + username + "/about.json";
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
			<a class="InfoBar__username" href="https://www.reddit.com/user/${user.data.name}">${user.data.subreddit.display_name_prefixed}</a>
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
	
	//Appends the response template listbox to the page
	function addResponseBox() {
		//Listbox element
		var responseBox = document.createElement('div');
		responseBox.classList.add("select");
		responseBox.innerHTML = `<h2 class="dataTitle">Response templates</h2>
		<select id="responseListbox" onchange="listBoxChanged(this.value);" onfocus="this.selectedIndex = -1;"/>
		<span class="focus"></span>`;
	
		//Script element to head
		var headJS = document.createElement('script');
		headJS.innerHTML = `function listBoxChanged(message) {
			var messageBox = document.getElementsByClassName("Textarea ThreadViewerReplyForm__replyText")[0];
			var responses = ${JSON.stringify(responses)};
			var response = responses.find(x => x.content == message);
			response.replace ? messageBox.value = message : messageBox.value += message;
			console.log("[ModmailExtraInfo] New messageBox value: %c" + messageBox.value,"color: orange");
		}`;
	
		function populate() {
			var select = $("#responseListbox");
			for(var i = 0; i < responses.length; i++) {
				select.options[select.options.length] = new Option(responses[i].name, responses[i].content);
			}
		}
	
		$(".ThreadViewer__replyContainer").prepend(responseBox);
		var head = $("head");
		head.appendChild(headJS);
	
		populate();
	}

	//Detects the current theme (dark/light) and applies the correct color (for the added elements)
	function themeColors() {
		var darkTheme = $$(".theme-dark").length ? true : false;
		if(darkTheme) {
			console.log("[ModmailExtraInfo] Dark mode detected! Setting colors...");
			textColor = darkModeTextColor;
			titleColor = darkModeTitleColor;
			listBoxColor = darkModeListColor;
		} else {
			console.log("[ModmailExtraInfo] Light mode detected! Setting colors...");
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
	}`;

	//Apply the custom css
	var styleSheet = document.createElement("style");
	styleSheet.type = "text/css";
	styleSheet.innerText = css;
	document.head.appendChild(styleSheet);

	addInfo();
	if(enableCustomResponses && $("#responseListbox") == null) addResponseBox();
	console.log("[ModmailExtraInfo] %cLoaded!", "color: lime");

} /* End of Main function */

/* Start Main function when visiting new modmail */
var pageURLCheckTimer = setInterval (function () {
	if (this.lastPathStr !== location.pathname) 
	{
		this.lastPathStr = location.pathname;

		first = true;

		let startInterval = setInterval (function () {
			if($(".InfoBar__username")) {
				if(first) main();
				first = false;
				clearInterval(startInterval);
			}
		}, 5);
	}
}, 100);
