async function main() {
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

	const methodURL = file => `https://raw.githubusercontent.com/Hakorr/Userscripts/main/Aternos.com/Methods/${file}`;
	const bypassAntiAdBlock = await GetFunctionsFromMd(methodURL("BypassAntiAdblock.md"));
	const findWarning = await GetFunctionsFromMd(methodURL("FindWarning.md"));
	const fixButtons = await GetFunctionsFromMd(methodURL("FixButtons.md"));

	function constructScript() {
		let header = $(`${headerId} select`).value;
		let bypass = $(`${bypassId} select`).value;
		let find = $(`${findId} select`).value;
		let fix = $(`${fixId} select`).value;

		let combined = `${header}\n\n${bypass}\n\n${find}\n\n${fix}`;
		$("#finalUserscript textarea").value = combined;
		console.log("Constructed the userscript!");
	}
	
	Array.from(document.querySelectorAll("textarea")).forEach(textarea => {
		textarea.addEventListener("input", function (e) {
		  this.style.height = "auto";
		  this.style.height = this.scrollHeight + "px";
		});
	});

	function adjustTextboxes() {
		Array.from(document.querySelectorAll("textarea")).forEach(textarea => {
			textarea.style.height = "auto";
			textarea.style.height = textarea.scrollHeight + "px";
		});
	}

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

	/* USERSCRIPT HEADER */
	//Fill the header dropdown
	let headerId = "#scriptHeader";
	headers.forEach(header => {
		const option = document.createElement("option");
		option.text = header.name;
		option.value = header.content;
		$(`${headerId} select`).appendChild(option);
	});
	//Userscript header dropdown selected
	$(`${headerId} select`).onchange = function() {
		$(`${headerId} textarea`).value = $(`${headerId} select`).value;
		adjustTextboxes();
		
		let button = $(`#${this.parentElement.id} .button`);
		button.style.display = "";
		button.onclick =  function() {
			this.parentElement.style.display = "none";
			$("body").style.backgroundColor = "lightblue";
			$(bypassId).style.display = "";
		}
	};

	/* BYPASS ADBLOCK */
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
		let button = $(`#${this.parentElement.id} .button`);
		button.style.display = "";
		adjustTextboxes();
		
		button.onclick =  function() {
			this.parentElement.style.display = "none";
			$("body").style.backgroundColor = "lightpink";
			$(findId).style.display = "";
		}
	};

	/* FIND WARNING */
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
		let button = $(`#${this.parentElement.id} .button`);
		button.style.display = "";
		adjustTextboxes();
		
		button.onclick =  function() {
			this.parentElement.style.display = "none";
			$("body").style.backgroundColor = "lightsalmon";
			$(fixId).style.display = "";
		}
	};

	/* FIX BUTTONS */
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
		constructScript();
		let button = $(`#${this.parentElement.id} .button`);
		button.style.display = "";
		adjustTextboxes();
		
		button.onclick =  function() {
			this.parentElement.style.display = "none";
			$("body").style.backgroundColor = "lightgreen";
			$("#finalUserscript").style.display = "";
		}
	};

	/* COPY BUTTON */
	$("#copyBtn").onclick = function() {
		let result = $("#result") ;
		result.select();
		result.setSelectionRange(0, 99999);
		$("body").style.backgroundColor = "grey";
		navigator.clipboard.writeText(result.value);
	};
}

main();
