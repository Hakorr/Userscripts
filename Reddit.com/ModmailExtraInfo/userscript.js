// ==UserScript==
// @name        [Reddit] ModmailExtraInfo
// @namespace   HKR
// @match       https://mod.reddit.com/mail/*
// @grant       none
// @version     1.1
// @author      HKR
// @description Shows additional user information on the sidebar of modmail
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @icon        https://www.redditstatic.com/modmail/favicon/favicon-32x32.png
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// ==/UserScript==

var dataColor = "#6e6e6e";

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
  var month = fixnumber(a.getMonth());
  var date = fixnumber(a.getDate());
  var hour = fixnumber(a.getHours());
  var min = fixnumber(a.getMinutes());
  var sec = fixnumber(a.getSeconds());
  var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function fixnumber(number) {
    if(number < 10) return "0" + number;
    else return number;
}

function addInfo(){
	var username = document.getElementsByClassName("InfoBar__username")[0].innerText;
	var about = "https://www.reddit.com/user/" + username +"/about.json";

	var user = JSON.parse(Get(about));

	var seperator = document.createElement('div');
	seperator.innerHTML = '<div class="InfoBar__modActions">'	
	 + '</div>';

	var userDetails = document.createElement('div');
	userDetails.innerHTML = '<div class="InfoBar__age">'
	+ '<h1 style="color: #1a1a1b; font-size: 18px; margin-bottom: 10px;">u/' + user.data.name + '\'s info</h1>'
	
	+ '<h1 style="color: #2c2c2c; font-size: 15px; margin-bottom: 3px; margin-top: 5px;">Icon</h1>'
	+ '<img style="margin-bottom: 10px; padding-left: 10px;" src="' + user.data.icon_img + '" width="50">'
	
	+ '<h1 style="color: #2c2c2c; font-size: 15px; margin-bottom: 3px; margin-top: 5px;">Main</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px; padding-left: 10px;">Created: ' + time(user.data.created) + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px; padding-left: 10px;">UserID: ' + user.data.id + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px; padding-left: 10px;">Verified: ' + user.data.verified + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px; padding-left: 10px;">Employee: ' + user.data.is_employee + '</h1>'
	
	+ '<h1 style="color: #2c2c2c; font-size: 15px; margin-top: 5px; margin-bottom: 3px;">Karma</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px; padding-left: 10px;">Post: ' + user.data.link_karma + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px; padding-left: 10px;">Comment: ' + user.data.comment_karma + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px; padding-left: 10px;">Total: ' + user.data.total_karma + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px; padding-left: 10px;">Awardee: ' + user.data.awardee_karma + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px; padding-left: 10px;">Awarder: ' + user.data.awarder_karma + '</h1>'
  
	+ '<h1 style="color: #2c2c2c; font-size: 15px; margin-bottom: 3px; margin-top: 5px;">Links</h1>'
	+ '<a style="padding-left: 10px;" class="InfoBar__recent" href="https://redditmetis.com/user/' + user.data.name + '" target="_blank">Redditmetis</a>'
	+ '<a style="padding-left: 10px;" class="InfoBar__recent" href="https://www.reddit.com/search?q=' + user.data.name + '" target="_blank">Reddit Search</a>'
	+ '<a style="padding-left: 10px;" class="InfoBar__recent" href="https://www.google.com/search?q=%22' + user.data.name + '%22" target="_blank">Google Search</a>'
	+ '<a style="padding-left: 10px;" class="InfoBar__recent" href="https://www.google.com/search?q=%22' + user.data.name + '%22%20site%3Areddit.com%20OR%20site%3Aredditgifts.com" target="_blank">Google Reddit Search</a>'
	+ '<a style="padding-bottom: 20px; padding-left: 10px;" class="InfoBar__recent" href="https://github.com/Hakorr/Userscripts/tree/main/Reddit.com/ModmailExtraInfo">Github</a>'
	
	+ '</div>';
	 
	document.getElementsByClassName("ThreadViewer__infobar")[0].appendChild(seperator);
	document.getElementsByClassName("ThreadViewer__infobar")[0].appendChild(userDetails);
}

const elementToWatch = 'a[class="InfoBar__username"]';
document.arrive(elementToWatch, function () {
	addInfo();
});

if(document.getElementsByClassName("InfoBar__username")[0]) addInfo();
