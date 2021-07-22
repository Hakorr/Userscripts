////////////////////////////////////
///////// Status Animator //////////
 
////////////////////////////////////
//Settings//////////////////////////
 
var name = "Status Animator";
var version = "V1.9";
var run = true;
 
//This cookie will contain your Token
var cookie_name = "DoNotShareThisToken";
var delete_cookie_after_a_week = true;
 
//Create no cookie, apply the token manually
var manual_discord_token = "";
 
//Your status will be changed to these after you close Discord
var default_status_text = "";
var default_status_emoji = "";
var default_status_state = "online";
 
async function loop() {
////////////////////////////////////
////////////////////////////////////
//Your animation code starts here///
 
 
await blink("🥳","I'm using Discord Status Animator!",2000,1);
 
if(await skip(10,"u")) return;
 
await settext("Get it here! Github.com/Hakor");
await wait(5000);
 
 
//Your animation code ends here/////
////////////////////////////////////
////////////////////////////////////
}
 
 
/////////////////////////////////////
/* Animation blocks /////////////////
Timeouts are in milliseconds! You can type "random" on the emoji section to randomize it!
- await wait(ms);
- await blank();
- await setstate("state");
	-> states = invisible, dnd, idle, online
- await setemoji("emoji");
- await settext("text");
- await status(emoji,text,state);
	-> states = invisible, dnd, idle, online
- await typewriter("emoji","text",timeout,reversed);
- await glitch("emoji","text",times,timeout);
- await glitchtype("emoji","text",timeout,glitch_rate,reversed);
- await sentence("emoji","text",timeout);
- await blink("emoji","text",timeout,times);
- await count("emoji","prefix",count_to,"suffix",timeout,reversed);
- if(await skip(1,"unique")) return;
	-> The unique string can be anything. If you use two skips, remember to make each one different.
- await activity("positive_emoji","positive_text","positive_state","negative_emoji","negative_text","negative_state");
- await scroll("emoji","text",timeout,center_amount,reversed);
	-> Center amount means how many times it will move the full text sideways
  
// DO NOT ENTER ZONE - DO NOT ENTER IF YOU DON'T KNOW WHAT TO DO //
/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
///////////////////////////////////////////////////////////////////
// DO NOT ENTER ZONE - DO NOT ENTER IF YOU DON'T KNOW WHAT TO DO //
 
// ==UserScript==
// @name         [Discord] Status Animator (Manual edit/Non-UI)
// @namespace    HKR
// @run-at       document-start
// @version      1.9
// @description  Automatically changes your Discord status
// @author       HKR
// @match        https://discord.com/discovery
// @match        https://discord.com/discovery/*
// @match        https://discord.com/store
// @match        https://discord.com/store/*
// @match        https://discord.com/channels
// @match        https://discord.com/channels/*
// @match        https://discord.com/app
// @grant        none
// ==/UserScript==
 
///////////////////////////////////////////////////
//Variables////////////////////////////////////////
 
//Return a random emoji
function random_emoji() {
 
	var emojis = [
		'😄','😃','😀','😊','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','🚶','🏃','💃','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','🙋','💆','💇','💅','👰','🙎','🙍','🙇','🎩','👑','👒','👟','👞','👡','👠','👢','👕','👔','👚','👗','🎽','👖','👘','👙','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭','🐶','🐺','🐱','🐭','🐹','🐰','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐑','🐘','🐼','🐧','🐦','🐤','🐥','🐣','🐔','🐍','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐚','🐠','🐟','🐬','🐳','🐋','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐎','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐫','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🌾','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','🌠','⭐','☀','⛅','☁','⚡','☔','❄','⛄','🌀','🌁','🌈','🌊','🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🎋','🎉','🎊','🎈','🎌','🔮','🎥','📷','📹','📼','💿','📀','💽','💾','💻','📱','☎','📞','📟','📠','📡','📺','📻','🔊','🔉','🔈','🔇','🔔','🔕','📢','📣','⏳','⌛','⏰','⌚','🔓','🔒','🔏','🔐','🔑','🔎','💡','🔦','🔆','🔅','🔌','🔋','🔍','🛁','🛀','🚿','🚽','🔧','🔩','🔨','🚪','🚬','💣','🔫','🔪','💊','💉','💰','💴','💵','💷','💶','💳','💸','📲','📧','📥','📤','✉','📩','📨','📯','📫','📪','📬','📭','📮','📦','📝','📄','📃','📑','📊','📈','📉','📜','📋','📅','📆','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','📖','🔖','📛','🔬','🔭','📰','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎹','🎻','🎺','🎷','🎸','👾','🎮','🃏','🎴','🀄','🎲','🎯','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏁','🏇','🏆','🎿','🏂','🏊','🏄','🎣','☕','🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽','🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌃','🗽','🌉','🎠','🎡','⛲','🎢','🚢','⛵','🚤','🚣','⚓','🚀','✈','💺','🚁','🚂','🚊','🚉','🚞','🚆','🚄','🚅','🚈','🚇','🚝','🚋','🚃','🚎','🚌','🚍','🚙','🚘','🚗','🚕','🚖','🚛','🚚','🚨','🚓','🚔','🚒','🚑','🚐','🚲','🚡','🚟','🚠','🚜','💈','🚏','🎫','🚦','🚥','⚠','🚧','🔰','⛽','🏮','🎰','♨','🗿','🎪','🎭','📍','🚩','⬆','⬇','⬅','➡','🔠','🔡','🔤','↗','↖','↘','↙','↔','↕','🔄','◀','▶','🔼','🔽','↩','↪','ℹ','⏪','⏩','⏫','⏬','⤵','⤴','🆗','🔀','🔁','🔂','🆕','🆙','🆒','🆓','🆖','📶','🎦','🈁','🈯','🈳','🈵','🈴','🈲','🉐','🈹','🈺','🈶','🈚','🚻','🚹','🚺','🚼','🚾','🚰','🚮','🅿','♿','🚭','🈷','🈸','🈂','Ⓜ','🛂','🛄','🛅','🛃','🉑','㊙','㊗','🆑','🆘','🆔','🚫','🔞','📵','🚯','🚱','🚳','🚷','🚸','⛔','✳','❇','❎','✅','✴','💟','🆚','📳','📴','🅰','🅱','🆎','🅾','💠','➿','♻','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','🔯','🏧','💹','💲','💱','©','®','™','〽','〰','🔝','🔚','🔙','🔛','🔜','❌','⭕','❗','❓','❕','❔','🔃','🕛','🕧','🕐','🕜','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕖','🕗','🕘','🕙','🕚','🕡','🕢','🕣','🕤','🕥','🕦','✖','➕','➖','➗','♠','♥','♣','♦','💮','💯','✔','☑','🔘','🔗','➰','🔱','🔲','🔳','◼','◻','◾','◽','▪','▫','🔺','⬜','⬛','⚫','⚪','🔴','🔵','🔻','🔶','🔷','🔸','🔹'
	];
 
	return emojis[Math.floor(Math.random() * emojis.length)];
}
 
//Output XX/XX/XX @ XX:XX:XX
function getDateTime() {
var currentdate = new Date(); 
 
	if(currentdate.getMinutes() > 9) var fixed_minutes = currentdate.getMinutes();
	else var fixed_minutes = "0" + currentdate.getMinutes();
	if(currentdate.getSeconds() > 9) var fixed_seconds = currentdate.getSeconds(); 
	else var fixed_seconds = "0" + currentdate.getSeconds();
 
	var datetime =  currentdate.getDate() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getFullYear() + " @ "  + currentdate.getHours() + ":" + fixed_minutes + ":" + fixed_seconds;
 
return datetime;
}
 
//Output: XX:XX:XX
function getExactTime() {
var currentdate = new Date(); 
 
	if(currentdate.getMinutes() > 9) var fixed_minutes = currentdate.getMinutes();
	else var fixed_minutes = "0" + currentdate.getMinutes();
	if(currentdate.getSeconds() > 9) var fixed_seconds = currentdate.getSeconds(); 
	else var fixed_seconds = "0" + currentdate.getSeconds();
 
	var datetime = currentdate.getHours() + ":" + fixed_minutes + ":" + fixed_seconds;
 
return datetime;
}
 
//Output: XX:XX
function getTime() {
var currentdate = new Date(); 
 
	if(currentdate.getMinutes() > 9) var fixed_minutes = currentdate.getMinutes();
	else var fixed_minutes = "0" + currentdate.getMinutes();
 
	var datetime = currentdate.getHours() + ":" + fixed_minutes;
 
return datetime;
}
 
//Generate random number between min and max
function random_number(min,max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
///////////////////////////////////////////////////
//Effects//////////////////////////////////////////
 
//Part of user activity function
var is_active = false;
window.onfocus = function() { is_active = true; }; 
window.onblur = function() { is_active = false; }
 
//Is user on the Discord tab - Return true or false
async function activity(positive_emoji,positive_text,positive_state,negative_emoji,negative_text,negative_state) {
	if(is_active) {
		if(positive_emoji != "random") await status(positive_emoji,positive_text,positive_state);
		else await status(random_emoji(),positive_text,positive_state);
	} else {
		if(negative_emoji != "random") await status(negative_emoji,negative_text,negative_state);
		else await status(random_emoji(),negative_text,negative_state);
	}
}
 
//Scroll effect
async function scroll(emoji,text,timeout,center_amount,reversed) {
	//Contains a space flag and a hidden special character at the end
	var space = " 󠀡";
 
	//Scroll in
	for(var i = 1; i <= text.length; i++) {
		
		if(!reversed) var cutted_text = text.substring(text.length - i);
		else var cutted_text = space.repeat(text.length - i + center_amount) + text.substring(i,0);
		
		if(emoji != "random") await status(emoji,cutted_text);
		else await status(random_emoji(),cutted_text);
 
		if(i != text.length) await wait(timeout);
	}
 
	//Scroll full text sideways for a bit
	for(var i = 1; i <= center_amount; i++) {
		if(!reversed) var move_text = space.repeat(i) + text;
		else var move_text = space.repeat(center_amount - i) + text;
 
		if(emoji != "random") await status(emoji,move_text);
		else await status(random_emoji(),move_text);
 
		await wait(timeout);
	}
 
	//Scroll out
	for(var i = 1; i <= text.length; i++) {
		
		if(!reversed) var cutted_text = space.repeat(i + center_amount) + text.substring(text.length - i,0);
		else var cutted_text = text.substring(i);
		
		if(emoji != "random") await status(emoji,cutted_text);
		else await status(random_emoji(),cutted_text);
 
		await wait(timeout);
	}
 
return;
}
 
//Typewriter effect
async function typewriter(emoji,text,timeout,reversed) {
	//Repeat for each letter
	for(var i = 1; i <= text.length; i++) {
		//Cut the text
		if(!reversed) var substring_text = text.substring(0,i);
		else var substring_text = text.substring(0,text.length - i);
		
		//Set the status to the cutted text
		if(emoji != "random") await status(emoji,substring_text);
		else await status(random_emoji(),substring_text);
		
		//Wait a selected amount of time until writing the next letter
		await wait(timeout);
	}
 
	return;
}
 
//Glitch effect
async function glitch(emoji,text,times,timeout) {
	//Repeat for each letter
	for(var i = 1; i < times; i++) {
		//Shuffle the text
		var glitch_text = shuffle(text)
		
		//Set the status to the cutted text
		if(emoji != "random") await status(emoji,glitch_text);
		else await status(random_emoji(),glitch_text);
		
		//Wait a selected amount of time until writing the next letter
		await wait(timeout);
	}
 
	return;
}
 
//Glitchtype effect
async function glitchtype(emoji,text,timeout,glitch_rate,reversed) {
	//Repeat for each letter
	for(var i = 1; i <= text.length; i++) {
		//Cut the text
		if(!reversed) var substring_text = text.substring(0,i);
		else var substring_text = text.substring(0,text.length - i);
		
		//Glitch rest of the text
		if(!reversed) var glitch_text = shuffle(text.substring(i));
		else var glitch_text = shuffle(text.substring(text.length - i));
		
		//Set the status to the cutted text + glitched text
		if(emoji != "random") await status(emoji,substring_text + glitch_text);
		else await status(random_emoji(),substring_text + glitch_text);
		
		//Wait a selected amount of time until writing the next letter
		await wait(timeout);
		
		for(var a = 0; a < glitch_rate; a++) {
			//Glitch rest of the text
			if(!reversed) var glitch_text = shuffle(text.substring(i));
			else var glitch_text = shuffle(text.substring(text.length - i));
			
			//Set the status to the cutted text + glitched text
			await status(emoji,substring_text + glitch_text);
			
			//Wait a selected amount of time until writing the next glitched characterset at the end of the string
			await wait(timeout/2);
		}
	}
		
	return;
}
 
//Sentence effect
async function sentence(emoji,text,timeout) {
	//Split sentence into words	
	var words = text.split(" ");
 
	//Repeat for each word
	for(var i = 0; i < words.length; i++) {
		//Set status to array's word
		if(emoji != "random") await status(emoji,words[i]);
		else await status(random_emoji(),words[i]);
		
		//Wait a selected amount of time until writing the next letter
		await wait(timeout);
	}
		
	return;
}
 
//Blink effect
async function blink(emoji,text,timeout,times) {
	for(var i = 0; i < times; i++) {
		if(emoji != "random") await status(emoji,text);
		else await status(random_emoji(),text);
		await wait(timeout);
		await blank();
		await wait(timeout);
	}
 
	return;
}
 
//Clear the status
async function blank() {
	//Could just send blank status as {"custom_status":null}, but that behaves weirdly.
	await status("","");
 
	return;
}
 
 
//Part of the skip function - stackoverflow.com/a/8630472
var store = (function() {
	var map = {};
 
	return {
		set: function ( name, value ) {
			map[ name ] = value;
		},
		get: function ( name ) {
			return map[ name ];
		}
	};
})();
 
//Skip the end of the animation
async function skip(amount,uniquetext) {
	var uniqueID = amount + "_" + uniquetext;
 
	var set = store.set;
	var get = store.get;
	var currentamount = get(uniqueID);
 
	//Check if there's a variable already
	if(currentamount >= 0) {
		//If to continue
		if(currentamount == amount) {
			//Reset the variable
			set(uniqueID,0);
			
			//Update the currentamount variable
			currentamount = get(uniqueID);
			
			//console.log("id: " + uniqueID + "\n\n value: " + get(uniqueID) + " | result: false\n\n");
			return false;
		}
		//Skip
		else {
			//Add one to the variable
			set(uniqueID,get(uniqueID) + 1);
			
			//Update the currentamount variable
			currentamount = get(uniqueID);
			
			//console.log("id: " + uniqueID + "\n\n value: " + get(uniqueID) + " | result: true\n\n");
			return true;
		}
	//If there was no variable made already
	} else {
		//Make the variable
		set(uniqueID,0);
		//Add one to it
		set(uniqueID,get(uniqueID) + 1);
		
		//Update the currentamount variable
		currentamount = get(uniqueID);
		
		//console.log("(FIRST TIME) " + "id: " + uniqueID + "\n\n value: " + get(uniqueID) + " | result: true\n\n");
		return true;
	}
}
 
//Count effect
async function count(emoji,prefix,count_to,suffix,timeout,reversed) {
	for(var i = 0; i < count_to; i++) {
		if(!reversed) {
			var recalculated_count = i + 1;
			var final_string = prefix + recalculated_count + suffix;
		}				
		else {
			var recalculated_count = count_to - i;
			var final_string = prefix + recalculated_count + suffix;
		}
		if(emoji != "random") await status(emoji,final_string);
		else await status(random_emoji(),final_string);
		
		await wait(timeout);
	}
	return;
}
 
///////////////////////////////////////////////////
//Main functions///////////////////////////////////
 
//codespeedy.com/shuffle-characters-of-a-string-in-javascript/
function getRandomInt(n) {
	return Math.floor(Math.random() * n);
}
 
//codespeedy.com/shuffle-characters-of-a-string-in-javascript/
function shuffle(s) {
	var arr = s.split('');           // Convert String to array
	var n = arr.length;              // Length of the array
 
	for(var i=0 ; i<n-1 ; ++i) {
		var j = getRandomInt(n);       // Get random of [0, n-1]
 
		var temp = arr[i];             // Swap arr[i] and arr[j]
		arr[i] = arr[j];
		arr[j] = temp;
	}
 
	s = arr.join('');                // Convert Array to string
	return s;                        // Return shuffled string
}
 
//Simple wait function for animation
function wait(t) {
	return new Promise(function(resolve) {
		setTimeout(resolve, t)
	});
}
 
//Function to read the saved cookie
window.getCookie = function(name) {
	var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	if (match) return match[2];
}
 
//If user has set their Token manually
if(manual_discord_token.length > 0) token = manual_discord_token;
else {
	//Set the Discord Token as a Cookie for future use of the script
	//If there is no Token cookie
	if(document.cookie.indexOf(cookie_name + "=") == -1) {
		//Ask user if they want to refresh the page to get the token
		if(confirm("\"" + cookie_name + "\" cookie not found. Refreshing Discord to get it.\n\n- " + name + " " + version)) {
			
			//Load the page again and create a new element which will have the token in its localStorage
			location.reload();
			var i = document.createElement('iframe');
			document.body.appendChild(i);
			
			//Get Token from localStorage
			var token = i.contentWindow.localStorage.token
			token = token.slice(1, -1);
			
			//Delete cookie after a week or not
			if(delete_cookie_after_a_week) 
				document.cookie = cookie_name + "=" + token + "; secure=true; max-age=604800; path=/";
			else
				document.cookie = cookie_name + "=" + token + "; secure=true; path=/";
 
		} else throw new Error("[Not an actually uncaught] User stopped the Status Animator. \n\nNo cookie was found and user decided not to continue.");
	}
}
 
 
var status_text = "";
var status_emoji = "";
var status_state = "";
//Function that changes the status variables (Saves up a bit space)
async function status(emoji,text,state) {
	if(run) {
		status_text = text;
		status_emoji = emoji;
		status_state = state;
		
		await setstatus();
		
		return;
	}
}
 
//Get Discord Token from saved Cookie
if(manual_discord_token.length > 0) var token = manual_discord_token;
else var token = getCookie(cookie_name);
 
//HTTP Request's URL address
var url = "https://discord.com/api/v9/users/@me/settings";
 
//Function that handles the HTTP request for the status change
async function setstatus() {
 
	var request = new XMLHttpRequest(); 
	request.open("PATCH", url); 
	request.setRequestHeader("Accept", "*/*" ); 
	request.setRequestHeader("Content-Type", "application/json"); 
	request.setRequestHeader("Authorization", token);
	request.send(JSON.stringify({"custom_status":{"text":status_text,"emoji_name":status_emoji}}));
 
	//If the request failed
	request.onreadystatechange = () => {
		if (request.status != 200) {
			run = false; 
			throw new Error("[Not an actually uncaught] Failed to update status. \n\nThe HTTP request failed. Most likely because the authorization token is incorrect.");
		}
	};
		
 
	if(status_state == "invisible" || status_state == "dnd" || status_state == "idle" || status_state == "online") {
		var request2 = new XMLHttpRequest(); 
		request2.open("PATCH", url); 
		request2.setRequestHeader("Accept", "*/*" ); 
		request2.setRequestHeader("Content-Type", "application/json"); 
		request2.setRequestHeader("Authorization", token);
		request2.send(JSON.stringify({"status":status_state}));
		
		//If the request failed
		request2.onreadystatechange = () => {
			if (request2.status != 200) {
				run = false; 
				throw new Error("[Not an actually uncaught] Failed to update status. \n\nThe HTTP request failed. Most likely because the authorization token is incorrect.");
			}
		};
	}
 
	return;
}
 
async function setstate(text) {
	if(run) {
		status_state = text;
		
		if(status_state == "invisible" || status_state == "dnd" || status_state == "idle" || status_state == "online") {
			var request = new XMLHttpRequest(); 
			request.open("PATCH", url); 
			request.setRequestHeader("Accept", "*/*" ); 
			request.setRequestHeader("Content-Type", "application/json"); 
			request.setRequestHeader("Authorization", token);
			request.send(JSON.stringify({"status":status_state}));
			
			//If the request failed
			request.onreadystatechange = () => {
				if (request.status != 200) {
					run = false; 
					throw new Error("[Not an actually uncaught] Failed to update state. \n\nThe HTTP request failed. Most likely because the authorization token is incorrect.");
				}
			};
		}
 
		return;
	}
}
 
async function setemoji(emoji) {
	if(run) {
		status_emoji = emoji;
		
		var request = new XMLHttpRequest(); 
		request.open("PATCH", url); 
		request.setRequestHeader("Accept", "*/*" ); 
		request.setRequestHeader("Content-Type", "application/json"); 
		request.setRequestHeader("Authorization", token);
		request.send(JSON.stringify({"custom_status":{"emoji_name":status_emoji}}));
 
		//If the request failed
		request.onreadystatechange = () => {
			if (request.status != 200) {
				run = false; 
				throw new Error("[Not an actually uncaught] Failed to update emoji. \n\nThe HTTP request failed. Most likely because the authorization token is incorrect.");
			}
		};
 
		return;
	}
}
 
async function settext(text) {
	if(run) {
		status_text = text;
		
		var request = new XMLHttpRequest(); 
		request.open("PATCH", url); 
		request.setRequestHeader("Accept", "*/*" ); 
		request.setRequestHeader("Content-Type", "application/json"); 
		request.setRequestHeader("Authorization", token);
		request.send(JSON.stringify({"custom_status":{"text":status_text}}));
 
		//If the request failed
		request.onreadystatechange = () => {
			if (request.status != 200) {
				run = false; 
				throw new Error("[Not an actually uncaught] Failed to update text. \n\nThe HTTP request failed. Most likely because the authorization token is incorrect.");
			}
		};
 
		return;
	}
}
 
//Loops the animation
async function animation_loop() {
	while(run) {
		await loop();
	}
}
 
//Start the animation loop
animation_loop();
 
//Edit/Clear status before exiting
window.onbeforeunload = function () {
	run = false;
 
	status_text = default_status_text;
	status_emoji = default_status_emoji;
 
	if(status_state == "invisible" || status_state == "dnd" || status_state == "idle" || status_state == "online")
	status_state = default_status_state;
 
	setstatus();
 
	return "";
};
