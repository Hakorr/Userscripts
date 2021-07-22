// ==UserScript==
// @name        [Github] User-mention to profile page
// @namespace   HKR
// @match       https://github.com/*
// @grant       none
// @version     1.0
// @author      HKR
// @description Changes the user-mention URL to the user's profile page
// @supportURL  https://github.com/Hakorr/Userscripts/issues
// ==/UserScript==
 
document.addEventListener('readystatechange', event => { 
    if (event.target.readyState === "complete") {
        var mentions = document.getElementsByClassName("commit-author user-mention");
 
        for (var i = 0; i < mentions.length; i++) {
            var username = mentions[i].getAttribute("href");
            username = username.substring(username.indexOf('='));
            username = username.substring(1);
 
            if(!username.includes('/') && !username.includes('.'))
                var user_url = "https://github.com/" + username;
            else 
                var user_url = "none";
 
            if(user_url != "none") {
                 mentions[i].setAttribute("href", user_url);
            }
        }
    }
});
