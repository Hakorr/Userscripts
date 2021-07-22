// ==UserScript==
// @name        [Reddit] ModmailAdditionalInfo
// @namespace   HKR
// @match       https://mod.reddit.com/mail/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Shows additional user information on the sidebar of modmail
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @icon        https://www.redditstatic.com/modmail/favicon/favicon-32x32.png
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// ==/UserScript==
 
function Get(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
 
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
 
function addInfo(){
	var dataColor = "#006DC6";
	var username = document.getElementsByClassName("InfoBar__username")[0].innerText;
	var about = "https://www.reddit.com/user/" + username +"/about.json";
 
	var user = JSON.parse(Get(about));
 
	var seperator = document.createElement('div');
	seperator.innerHTML = '<div class="InfoBar__modActions">'	
	 + '</div>';
 
	var userDetails = document.createElement('div');
	userDetails.innerHTML = '<div class="InfoBar__age">'
	+ '<h1 style="color: #1a1a1b; font-size: 18px; margin-bottom: 10px;">u/' + user.data.name + '\'s info</h1>'
	+ '<h1 style="color: #515151; font-size: 15px; margin-bottom: 3px;">Karma</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">Total: ' + user.data.total_karma + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">Post: ' + user.data.link_karma + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">Comment: ' + user.data.comment_karma + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">Awardee: ' + user.data.awardee_karma + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">Awarder: ' + user.data.awarder_karma + '</h1>'
 
	+ '<h1 style="color: #515151; font-size: 15px; margin-bottom: 3px; margin-top: 5px;">Other</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">UserID: ' + user.data.id + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">Created: ' + timeConverter(user.data.created) + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">Verified: ' + user.data.verified + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">Gold: ' + user.data.is_gold + '</h1>'
	+ '<h1 style="color: '+ dataColor +'; font-size: 13px;">Employee: ' + user.data.is_employee + '</h1>'
	+ '<h1 style="color: #515151; font-size: 15px; margin-bottom: 3px; margin-top: 5px;">Icon</h1>'
	+ '<img style="margin-bottom: 10px;" src="' + user.data.icon_img + '" width="100">'
 
	+ '</div>';
	 
	document.getElementsByClassName("ThreadViewer__infobar")[0].appendChild(seperator);
	document.getElementsByClassName("ThreadViewer__infobar")[0].appendChild(userDetails);
}
 
const elementToWatch = 'a[class="InfoBar__username"]';
document.arrive(elementToWatch, function () {
	addInfo();
});
 
if(document.getElementsByClassName("InfoBar__username")[0]) addInfo();
