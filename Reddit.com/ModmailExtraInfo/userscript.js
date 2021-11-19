// ==UserScript==
// @name        [Reddit] ModmailExtraInfo
// @namespace   HKR
// @match       https://mod.reddit.com/mail/*
// @grant       none
// @version     1.7
// @author      HKR
// @description Shows additional user information on the sidebar of modmail
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @icon        https://www.redditstatic.com/modmail/favicon/favicon-32x32.png
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// ==/UserScript==

/* NOTE: (If you want to use the Custom Responses) Reddit's sync feature removes the script's added text. This is a bug in my script and can be fixed with time.
If you block "https://oauth.reddit.com/api/mod/conversations/*****?markRead=false&redditWebClient=modmail", the added text will stay. Thanks for understanding.*/

/* VARIABLES FOR RESPONSES */
var subTag, userTag, modmail;
function setRespondVariables() {
	subTag = document.getElementsByClassName("ThreadTitle__community")[0].href.slice(23);
	userTag = "u/" + document.getElementsByClassName("InfoBar__username")[0].innerText;
	modmail = `[modmail](https://www.reddit.com/message/compose?to=/${subTag})`;
}

/* SETTINGS */

//Text color settings
var textColor = null, lightModeTextColor = "#6e6e6e", darkModeTextColor = "#757575";

//Title color settings
var titleColor = null, lightModeTitleColor = "#2c2c2c", darkModeTitleColor = "#a7a7a7";

//Listbox color settings
var listBoxColor = null, lightModeListColor = "#fff", darkModeListColor = "#242424";

//Data (Such as numbers) color settings
var dataColor = "#0079d3";

//If false, no response list is created
var enableCustomResponses = true;

//Feel free to edit and add more responses suitable for you! Replace means if to replace all text or just to add the text.
var responses = [
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
		"content":`Your post broke our rules.\n\nThe action will not be reverted.`
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

function Get(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function time(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = fixnumber(a.getHours());
  var min = fixnumber(a.getMinutes());
  var sec = fixnumber(a.getSeconds());
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function fixnumber(number) {
    if(number < 10) return "0" + number;
    else return number;
}

function sanitize(evilstring) {
    const decoder = document.createElement('div')
    decoder.innerHTML = evilstring;
    return decoder.textContent;
}

//Function that appends HTML into the Modmail page
function addInfo(){
	//Load and parse username
	var username = document.getElementsByClassName("InfoBar__username")[0].innerText;
	var about = "https://www.reddit.com/user/" + username + "/about.json";
	var user = JSON.parse(Get(about));

	//Separator HTML element
	var seperator = document.createElement('div');
	seperator.innerHTML = '<div class="InfoBar__modActions"></div>';

	//HTML element that contains all the data
	var userDetails = document.createElement('div');
	userDetails.classList.add("InfoBar__age");
	userDetails.innerHTML = `
	<img class="profileIcon" src="${user.data.icon_img}" width="25">
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
	</div>
	`;
	
	//Arrange items and append
	document.getElementsByClassName("ThreadViewer__infobar")[0].appendChild(seperator);
	document.getElementsByClassName("ThreadViewer__infobar")[0].appendChild(userDetails);
	document.getElementsByClassName("ThreadViewer__infobar")[0].appendChild(document.getElementsByClassName("ThreadViewer__infobar")[0].firstChild);
	document.getElementsByClassName("InfoBar")[0].appendChild(document.getElementsByClassName("InfoBar__modActions")[0]);
	document.getElementsByClassName("InfoBar")[0].insertBefore(document.getElementsByClassName("InfoBar__modActions")[0],document.getElementsByClassName("InfoBar")[0].firstChild);
	if(document.getElementsByClassName("InfoBar__banText")[0])
		document.getElementsByClassName("ThreadViewer__infobar")[0].insertBefore(document.getElementsByClassName("InfoBar__banText")[0],document.getElementsByClassName("ThreadViewer__infobar")[0].firstChild);
	document.getElementsByClassName("InfoBar__username")[1].outerHTML = "";
	document.getElementsByClassName("InfoBar__age")[1].outerHTML = "";
	document.getElementsByClassName("InfoBar__modActions")[1].outerHTML = "";
}

function addResponseBox() {
	//Listbox element
	var responseBox = document.createElement('div');
	responseBox.classList.add("select");
	responseBox.innerHTML = `
	<h2 class="dataTitle">Response templates</h2>
	<select id="responseListbox" onchange="listBoxChanged(this.value);" onfocus="this.selectedIndex = -1;"/>
	<span class="focus"></span>
	`;

	//Script element to head
	var headJS = document.createElement('script');
	headJS.innerHTML = `
	function listBoxChanged(message) {
		var messageBox = document.getElementsByClassName("Textarea ThreadViewerReplyForm__replyText")[0];
		var responses = ${JSON.stringify(responses)};
		var response = responses.find(x => x.content == message);
		response.replace ? messageBox.value = message : messageBox.value += message;
		console.log("Set message to: " + message);
	}
	`;

	function populate() {
		var select = document.getElementById("responseListbox");
		for(var i = 0; i < responses.length; i++) {
			select.options[select.options.length] = new Option(responses[i].name, responses[i].content);
		}
	}

	document.getElementsByClassName("ThreadViewer__replyContainer")[0].prepend(responseBox);
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(headJS);

	populate();
}

function themeColors() {
	var darkTheme = document.getElementsByClassName("theme-dark").length ? true : false;
	if(darkTheme) {
		console.log("Dark mode detected!");
		textColor = darkModeTextColor;
		titleColor = darkModeTitleColor;
		listBoxColor = darkModeListColor;
	} else {
		console.log("Light mode detected!");
		textColor = lightModeTextColor;
		titleColor = lightModeTitleColor;
		listBoxColor = lightModeListColor;
	}
}

//When Modmail conversation has been opened, load the HTML elements with the correct data
const elementToWatch = 'a[class="InfoBar__username"]';
document.arrive(elementToWatch, function () {
	themeColors();
	addInfo();
	setRespondVariables();
	if(enableCustomResponses) addResponseBox();
});

if(document.getElementsByClassName("InfoBar__username")[0]) { 
	themeColors();
	addInfo();
	setRespondVariables();
	if(enableCustomResponses) addResponseBox(); 
}

//Took advice for the listbox CSS from moderncss.dev/custom-select-styles-with-pure-css, thanks!
var css = `
.profileIcon:hover {
	-ms-transform: scale(6);
	-webkit-transform: scale(6);
	transform: scale(6);
}
.profileIcon {
	position: relative;
	bottom: 4px;
	margin-bottom: 10px;
	float: left; border-radius: 50%;
	transition: transform .2s;
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
.ThreadViewer__threadContainer.m-has-infobar {
	right: 340px;
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
	font-family: inherit;
	font-size: inherit;
	cursor: inherit;
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
	cursor: pointer;
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
`;

//Apply the custom css
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = css;
document.head.appendChild(styleSheet);
