// ==UserScript==
// @name        [Reddit] ModmailExtraInfo
// @namespace   HKR
// @match       https://mod.reddit.com/mail/*
// @grant       none
// @version     1.2
// @author      HKR
// @description Shows additional user information on the sidebar of modmail
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @icon        https://www.redditstatic.com/modmail/favicon/favicon-32x32.png
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// ==/UserScript==

var textColor = "#6e6e6e";
var dataColor = "#0079d3";

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

function addCSS(cssCode) {
var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssCode;
  } else {
    styleElement.appendChild(document.createTextNode(cssCode));
  }
  document.getElementsByTagName("head")[0].appendChild(styleElement);
}

addCSS(".profileIcon:hover {-ms-transform: scale(6); -webkit-transform: scale(6); transform: scale(6);}");
addCSS(".profileIcon {position: relative; bottom: 4px;}");
addCSS(".InfoBar__recentsNone {color: #6e6e6e;}");
addCSS(".InfoBar__metadata, .InfoBar__recents { margin: 6px 0; margin-left: 10px;}");
addCSS(".value {color:"+ dataColor +";}");
addCSS(".InfoBar__banText {padding-bottom: 15px;}");
addCSS(".InfoBar__username, .InfoBar__username:visited {padding-left: 10px;}");
addCSS(".ThreadViewer__infobarContainer {display: table;}");

function addInfo(){
	var username = document.getElementsByClassName("InfoBar__username")[0].innerText;
	var about = "https://www.reddit.com/user/" + username +"/about.json";

	var user = JSON.parse(Get(about));

	var seperator = document.createElement('div');
	seperator.innerHTML = '<div class="InfoBar__modActions">'
	 + '</div>';

	var userDetails = document.createElement('div');
	userDetails.innerHTML = '<div class="InfoBar__age">'
	+ '<img class="profileIcon" style="margin-bottom: 10px; float: left; border-radius: 50%; transition: transform .2s;" src="' + user.data.icon_img + '" width="25">'
	+ '<a class="InfoBar__username" href="https://www.reddit.com/user/'+ user.data.name +'">' + user.data.subreddit.display_name_prefixed + '</a>'
	
	+ '<h1 style="color: '+ textColor +'; font-size: 11px; margin-top: 17px; margin-bottom: 10px;">' + user.data.subreddit.public_description + '</h1>'
	
	+ '<h1 style="color: #2c2c2c; font-size: 15px; margin-bottom: 3px; margin-top: 5px;">Main</h1>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">Created: <span class="value">' + time(user.data.created) + '</span></p>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">UserID: <span class="value">' + user.data.id + '</span></p>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">Verified: <span class="value">' + user.data.verified + '</span></p>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">Employee: <span class="value">' + user.data.is_employee + '</span></p>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">NSFW Profile: <span class="value">' + user.data.subreddit.over_18 + '</span></p>'
	
	+ '<h1 style="color: #2c2c2c; font-size: 15px; margin-top: 5px; margin-bottom: 3px;">Karma</h1>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">Post: <span class="value">' + user.data.link_karma + '</span></p>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">Comment: <span class="value">' + user.data.comment_karma + '</span></p>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">Total: <span class="value">' + user.data.total_karma + '</span></p>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">Awardee: <span class="value">' + user.data.awardee_karma + '</span></p>'
	+ '<p style="color: '+ textColor +'; font-size: 13px; padding-left: 10px;">Awarder: <span class="value">' + user.data.awarder_karma + '</span></p>'

	+ '<h1 style="color: #2c2c2c; font-size: 15px; margin-bottom: 3px; margin-top: 5px;">Links</h1>'
	+ '<a style="padding-left: 10px;" class="InfoBar__recent" href="https://redditmetis.com/user/' + user.data.name + '" target="_blank">Redditmetis</a>'
	+ '<a style="padding-left: 10px;" class="InfoBar__recent" href="https://www.reddit.com/search?q=' + user.data.name + '" target="_blank">Reddit Search</a>'
	+ '<a style="padding-left: 10px;" class="InfoBar__recent" href="https://www.google.com/search?q=%22' + user.data.name + '%22" target="_blank">Google Search</a>'
	
	+ '</div>';
	
	
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
  	//document.getElementsByClassName("InfoBar__modActions")[0].outerHTML = document.getElementsByClassName("InfoBar__modActions")[0].outerHTML + "<div class=\"InfoBar__modActions\"></div>";
}

const elementToWatch = 'a[class="InfoBar__username"]';
document.arrive(elementToWatch, function () {
	addInfo();
});

if(document.getElementsByClassName("InfoBar__username")[0]) addInfo();
