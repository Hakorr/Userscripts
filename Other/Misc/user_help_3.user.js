// ==UserScript==
// @name        HuutoFirefoxFontKorjaus
// @namespace   -
// @match       https://www.huuto.net/kohteet/*
// @grant       none
// @version     1.0
// @author      -
// @description https://www.reddit.com/r/Suomi/comments/15jjjjz/mink%C3%A4_takia_huutonettuotesivut_rikkoontuu_kun/
// @run-at      document-load
// ==/UserScript==

document.querySelectorAll('.show-for-small-only')
    .forEach(elem => elem.classList.remove('show-for-small-only'));
