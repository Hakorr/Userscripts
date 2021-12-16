// ==UserScript==
// @name        [Aternos] AutoAccountGen Button
// @namespace   HKR
// @match       https://aternos.org/signup/*
// @grant       none
// @version     1.0
// @author      HKR
// @description document-load
// ==/UserScript==

//Select a password you want to use
let defaultPass = "";

let btn = document.createElement('div');
btn.innerHTML = `<div id="genAcc" class="btn btn-main btn-large btn-enabled">
<i class="fas fa-chevron-circle-right"></i>Generate</div>`;

document.querySelector(".go-create-buttons").prepend(btn);

document.querySelector("#user").value = Math.random().toString(36).substring(2, Math.floor(Math.random() * 40) + + 10);
document.querySelector("#accept-terms").click();
document.querySelector("#prvcy-cnsnt").click();
document.querySelector("#create-next").click();

document.querySelector("#password").value = defaultPass;
document.querySelector("#password-retype").value = defaultPass;

setTimeout(function() {
    document.querySelector("#signup").click();
}, 100);
