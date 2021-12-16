const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

async function Get(url) {
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let text = await response.text();
  return text;
}

async function GetFunctionsFromMd(URL) {
  let string = await Get(URL);
  let resultObj = [];

  //It's not made to be understood - leave it, don't say a word - shh
  string.split("---").forEach(s => {
      s.split('####').forEach(s => {
          let trimmed = s.trimStart().trimEnd();
          let split = trimmed.split("```js");
          if(trimmed.length != 0 && split.length == 2) {
              //Function's name
              let name = split[0].
                  split('\n')[0];
        
              //Function's code
              let code = split[1]
                  .trimStart()
                  .substr(0,split[1].length - 5);
        
              resultObj.push({
                  "name":name,
                  "code":code
              });
          }
      });
  });

  return resultObj;
}

async function main() {
  const methodURL = file => `https://raw.githubusercontent.com/Hakorr/Userscripts/main/Aternos.com/Methods/${file}`;

  const bypassAntiAdBlock = await GetFunctionsFromMd(methodURL("BypassAntiAdblock.md"));
  const findWarning = await GetFunctionsFromMd(methodURL("FindWarning.md"));
  const fixButtons = await GetFunctionsFromMd(methodURL("FixButtons.md"));

  /* ------------ */

  //FIll the bypassId dropdown
  let bypassId = "#antiAdBlock";
  bypassAntiAdBlock.forEach(func => {
    const option = document.createElement("option");
    option.text = func["name"];
    option.value = func["code"];
    $(`${bypassId} select`).appendChild(option);
  });

  //bypassId dropdown value selected
  $(`${bypassId} select`).onchange = function() {
    $(`${bypassId} textarea`).value = $(`${bypassId} select`).value;
  };

  /* ------------ */

  //Fill the findWarning dropdown
  let findId = "#findWarning";
  findWarning.forEach(func => {
    const option = document.createElement("option");
    option.text = func["name"];
    option.value = func["code"];
    $(`${findId} select`).appendChild(option);
  });

  //findId dropdown value selected
  $(`${findId} select`).onchange = function() {
    $(`${findId} textarea`).value = $(`${findId} select`).value;
  };

  /* ------------ */

  //Fill the fixButtons dropdown
  let fixId = "#fixButtons";
  fixButtons.forEach(func => {
    const option = document.createElement("option");
    option.text = func["name"];
    option.value = func["code"];
    $(`${fixId} select`).appendChild(option);
  });

  //fixButtons dropdown value selected
  $(`${fixId} select`).onchange = function() {
    $(`${fixId} textarea`).value = $(`${fixId} select`).value;
  };

  let headerId = "#scriptHeader";
  let headers = [
    {
      name:"Default",
      content:`// ==UserScript==
// @name        [Aternos] AntiAntiAdblock
// @namespace   name
// @match       https://aternos.org/*
// @grant       none
// @version     1.0
// @author      name
// @description Removes all the adblock reminders.
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @run-at      document-start
// ==/UserScript==`
    }
  ];

  //Fill the header dropdown
  headers.forEach(header => {
    const option = document.createElement("option");
    option.text = header.name;
    option.value = header.content;
    $(`${headerId} select`).appendChild(option);
  });

  //Userscript header dropdown selected
  $(`${headerId} select`).onchange = function() {
    $(`${headerId} textarea`).value = $(`${headerId} select`).value;
  };

  /* ------------ */

  $("#buildBtn").onclick = function() {
    let header = $(`${headerId} select`).value;
    let bypass = $(`${bypassId} select`).value;
    let find = $(`${findId} select`).value;
    let fix = $(`${fixId} select`).value;

    let combined = `${header}\n\n${bypass}\n\n${find}\n\n${fix}`;
    $("#finalUserscript textarea").value = combined;
    console.log("Constructed the userscript!");
  };
}

main();