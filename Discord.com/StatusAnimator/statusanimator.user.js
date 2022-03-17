// ==UserScript==
// @name         [Discord] Status Animator (Manual edit/Non-UI)
// @namespace    HKR
// @version      2.0
// @description  Automatically changes your Discord status
// @author       HKR
// @match        https://discord.com/discovery
// @match        https://discord.com/discovery/*
// @match        https://discord.com/store
// @match        https://discord.com/store/*
// @match        https://discord.com/channels
// @match        https://discord.com/channels/*
// @match        https://discord.com/app
// @supportURL   https://github.com/Hakorr/Userscripts/issues
// @run-at       document-start
// ==/UserScript==

(() => {
	/////////////////////////////////////
	/* Animation blocks /////////////////
	
	(Timeouts are in milliseconds)
	(You can type "random" on the emoji slot to randomize it)

	- await wait(ms);
	- await blank();
	- await state("state");
		-> states = invisible, dnd, idle, online
	- await emoji("emoji");
	- await text("text");
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
		-> Center amount means how many times it will move the full text sideways*/

	////////////////////////////////////
	//Animation loop////////////////////

	// Do not leave the function empty, you'll freeze your page!
	// Remember to add delays, otherwise your page will freeze!

	async function loop() {
		////////////////////////////////////
		////////////////////////////////////
		//Your animation code starts here///
			
		await blink("🥳","I'm using Discord Status Animator!", 3000, 1);
		
		if(await skip(10, "u")) return;
			
		await text("Get it here! Github.com/Hakorr");
		await wait(5000);

		//Your animation code ends here/////
		////////////////////////////////////
		////////////////////////////////////
	}

	////////////////////////////////////
	//Settings//////////////////////////

	// Create no variable, apply the token manually
	const MANUAL_DISCORD_TOKEN = "";
		
	// Your status will be changed to these after you exit Discord
	const DEFAULT_STATUS_TEXT = "";
	const DEFAULT_STATUS_EMOJI = "";
	const DEFAULT_STATUS_STATE = "online";

	// DO NOT ENTER ZONE - DO NOT PROCEED IF YOU DON'T KNOW WHAT TO DO //
	/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
	/////////////////////////////////////////////////////////////////////
	// DO NOT ENTER ZONE - DO NOT PROCEED IF YOU DON'T KNOW WHAT TO DO //

	///////////////////////////////////////////////////
	//Effect variables/////////////////////////////////

	function randomEmoji() {
		const emojis = [
			'😄','😃','😀','😊','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','🚶','🏃','💃','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','🙋','💆','💇','💅','👰','🙎','🙍','🙇','🎩','👑','👒','👟','👞','👡','👠','👢','👕','👔','👚','👗','🎽','👖','👘','👙','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭','🐶','🐺','🐱','🐭','🐹','🐰','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐑','🐘','🐼','🐧','🐦','🐤','🐥','🐣','🐔','🐍','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐚','🐠','🐟','🐬','🐳','🐋','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐎','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐫','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🌾','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','🌠','⭐','☀','⛅','☁','⚡','☔','❄','⛄','🌀','🌁','🌈','🌊','🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🎋','🎉','🎊','🎈','🎌','🔮','🎥','📷','📹','📼','💿','📀','💽','💾','💻','📱','☎','📞','📟','📠','📡','📺','📻','🔊','🔉','🔈','🔇','🔔','🔕','📢','📣','⏳','⌛','⏰','⌚','🔓','🔒','🔏','🔐','🔑','🔎','💡','🔦','🔆','🔅','🔌','🔋','🔍','🛁','🛀','🚿','🚽','🔧','🔩','🔨','🚪','🚬','💣','🔫','🔪','💊','💉','💰','💴','💵','💷','💶','💳','💸','📲','📧','📥','📤','✉','📩','📨','📯','📫','📪','📬','📭','📮','📦','📝','📄','📃','📑','📊','📈','📉','📜','📋','📅','📆','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','📖','🔖','📛','🔬','🔭','📰','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎹','🎻','🎺','🎷','🎸','👾','🎮','🃏','🎴','🀄','🎲','🎯','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏁','🏇','🏆','🎿','🏂','🏊','🏄','🎣','☕','🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽','🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌃','🗽','🌉','🎠','🎡','⛲','🎢','🚢','⛵','🚤','🚣','⚓','🚀','✈','💺','🚁','🚂','🚊','🚉','🚞','🚆','🚄','🚅','🚈','🚇','🚝','🚋','🚃','🚎','🚌','🚍','🚙','🚘','🚗','🚕','🚖','🚛','🚚','🚨','🚓','🚔','🚒','🚑','🚐','🚲','🚡','🚟','🚠','🚜','💈','🚏','🎫','🚦','🚥','⚠','🚧','🔰','⛽','🏮','🎰','♨','🗿','🎪','🎭','📍','🚩','⬆','⬇','⬅','➡','🔠','🔡','🔤','↗','↖','↘','↙','↔','↕','🔄','◀','▶','🔼','🔽','↩','↪','ℹ','⏪','⏩','⏫','⏬','⤵','⤴','🆗','🔀','🔁','🔂','🆕','🆙','🆒','🆓','🆖','📶','🎦','🈁','🈯','🈳','🈵','🈴','🈲','🉐','🈹','🈺','🈶','🈚','🚻','🚹','🚺','🚼','🚾','🚰','🚮','🅿','♿','🚭','🈷','🈸','🈂','Ⓜ','🛂','🛄','🛅','🛃','🉑','㊙','㊗','🆑','🆘','🆔','🚫','🔞','📵','🚯','🚱','🚳','🚷','🚸','⛔','✳','❇','❎','✅','✴','💟','🆚','📳','📴','🅰','🅱','🆎','🅾','💠','➿','♻','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','🔯','🏧','💹','💲','💱','©','®','™','〽','〰','🔝','🔚','🔙','🔛','🔜','❌','⭕','❗','❓','❕','❔','🔃','🕛','🕧','🕐','🕜','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕖','🕗','🕘','🕙','🕚','🕡','🕢','🕣','🕤','🕥','🕦','✖','➕','➖','➗','♠','♥','♣','♦','💮','💯','✔','☑','🔘','🔗','➰','🔱','🔲','🔳','◼','◻','◾','◽','▪','▫','🔺','⬜','⬛','⚫','⚪','🔴','🔵','🔻','🔶','🔷','🔸','🔹'
		];
		
		return emojis[Math.floor(Math.random() * emojis.length)];
	}

	const getTime = mode => {
		const currentdate = new Date(); 
		let fixedMinutes = "";
		let fixedSeconds = "";

		if(currentdate.getMinutes() > 9)
			fixedMinutes = currentdate.getMinutes();
		else 
			fixedMinutes = "0" + currentdate.getMinutes();

		if(currentdate.getSeconds() > 9)
			fixedSeconds = currentdate.getSeconds(); 
		else
			fixedSeconds = "0" + currentdate.getSeconds();

		switch(mode) {
			case "full": // XX/XX/XX @ XX:XX:XX
				return `${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${fixedMinutes}:${fixedSeconds}`;
			case "exact": // XX:XX:XX
				return currentdate.getHours() + ":" + fixedMinutes + ":" + fixedSeconds;
			default: // XX:XX
				return currentdate.getHours() + ":" + fixedMinutes;
		}
	};
		
	const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
		
	///////////////////////////////////////////////////
	//Effects//////////////////////////////////////////

	const wait = t => new Promise(resolve => setTimeout(resolve, t)); // simple delay function for the animation

	let USER_ON_PAGE = true;
	window.onfocus = () => USER_ON_PAGE = true;
	window.onblur = () => USER_ON_PAGE = false;

	// Activity effect
	async function activity(positive_emoji, positive_text, positive_state, negative_emoji, negative_text, negative_state) {
		await status(
			(
				positive_emoji == "random" 
					? randomEmoji() 
					: USER_ON_PAGE 
						? positive_emoji 
						: negative_emoji
			),
			USER_ON_PAGE ? positive_text : negative_text,
			USER_ON_PAGE ? positive_state : negative_state
		);

		return;
	}
		
	// Scroll effect
	async function scroll(emoji, text, timeout, center_amount, reversed) {
		let space = " 󠀡"; // contains a space flag and a hidden special character at the end (may appear funky on some devices)
		
		// Scroll in
		for(let i = 1; i <= text.length; i++) {
			let cutted_text = reversed 
				? space.repeat(text.length - i + center_amount) + text.substring(i, 0)
				: text.substring(text.length - i);
			
			if(emoji != "random")
				await status(emoji, cutted_text);
			else
				await status(randomEmoji(), cutted_text);
		
			if(i != text.length)
				await wait(timeout);
		}
		
		// Scroll full text sideways for a bit
		for(let i = 1; i <= center_amount; i++) {
			let move_text = reversed
				? space.repeat(center_amount - i) + text
				: space.repeat(i) + text;
		
			if(emoji != "random")
				await status(emoji, move_text);
			else
				await status(randomEmoji(), move_text);
		
			await wait(timeout);
		}
		
		// Scroll out
		for(let i = 1; i <= text.length; i++) {
			let cutted_text = reversed 
				? text.substring(i)
				: space.repeat(i + center_amount) + text.substring(text.length - i, 0);
			
			if(emoji != "random")
				await status(emoji, cutted_text);
			else
				await status(randomEmoji(), cutted_text);
		
			await wait(timeout);
		}
		
		return;
	}
		
	// Typewriter effect
	async function typewriter(emoji, text, timeout, reversed) {
		// Repeat for each letter
		for(let i = 1; i <= text.length; i++) {
			// Cut the text
			let substring_text = reversed
				? text.substring(0, text.length - i)
				: text.substring(0, i);
			
			// Set the status to the cutted text
			if(emoji != "random")
				await status(emoji, substring_text);
			else
				await status(randomEmoji(), substring_text);
			
			// Wait a selected amount of time until writing the next letter
			await wait(timeout);
		}
		
		return;
	}
		
	// Glitch effect
	async function glitch(emoji, text, times, timeout) {
		// Repeat for each letter
		for(let i = 1; i < times; i++) {
			// Shuffle the text
			let glitch_text = shuffle(text);
			
			// Set the status to the cutted text
			if(emoji != "random")
				await status(emoji, glitch_text);
			else
				await status(randomEmoji(), glitch_text);
			
			// Wait a selected amount of time until writing the next letter
			await wait(timeout);
		}
		
		return;
	}
		
	// Glitchtype effect
	async function glitchtype(emoji, text, timeout, glitch_rate, reversed) {
		// Repeat for each letter
		for(let i = 1; i <= text.length; i++) {
			// Cut the text
			let substring_text = reversed
				? text.substring(0, text.length - i)
				: text.substring(0, i);

			// Glitch rest of the text
			let glitch_text = reversed
				? shuffle(text.substring(text.length - i))
				: shuffle(text.substring(i));
			
			//S et the status to the cutted text + glitched text
			if(emoji != "random")
				await status(emoji, substring_text + glitch_text);
			else
				await status(randomEmoji(), substring_text + glitch_text);
			
			// Wait a selected amount of time until writing the next letter
			await wait(timeout);
			
			for(let a = 0; a < glitch_rate; a++) {
				// Glitch rest of the text
				let glitch_text = reversed
					? shuffle(text.substring(text.length - i))
					: shuffle(text.substring(i));

				// Set the status to the cutted text + glitched text
				await status(emoji, substring_text + glitch_text);
				
				// Wait a selected amount of time until writing the next glitched characterset at the end of the string
				await wait(timeout / 2);
			}
		}
			
		return;
	}
		
	// Sentence effect
	async function sentence(emoji, text, timeout) {
		// Split sentence into words	
		const words = text.split(" ");
		
		// Repeat for each word
		for(let i = 0; i < words.length; i++) {
			// Set status to array's word
			if(emoji != "random")
				await status(emoji, words[i]);
			else
				await status(randomEmoji(), words[i]);
			
			// Wait a selected amount of time until writing the next letter
			await wait(timeout);
		}
			
		return;
	}
		
	// Blink effect
	async function blink(emoji, text, timeout, times) {
		for(let i = 0; i < times; i++) {
			if(emoji != "random") 
				await status(emoji, text);
			else 
				await status(randomEmoji(), text);

			await wait(timeout);

			await blank();

			await wait(timeout);
		}
		
		return;
	}
		
	// Clear status effect
	async function blank() {
		await status("",""); // could just send blank status as {"custom_status":null}, but that behaves weirdly
		
		return;
	}
		
	const store = (function() {
		const map = {};
		
		return {
			set: function ( name, value ) {
				map[ name ] = value;
			},
			get: function ( name ) {
				return map[ name ];
			}
		};
	})();
		
	// Skip the end of the animation effect
	async function skip(amount, uniquetext) {
		const uniqueID = amount + "_" + uniquetext;
		
		const set = store.set;
		const get = store.get;

		let currentamount = get(uniqueID);
		
		// Variable exists already
		if(currentamount >= 0) {
			// If to continue
			if(currentamount == amount) {
				// Reset the variable
				set(uniqueID,0);
				
				// Update the currentamount variable
				currentamount = get(uniqueID);

				return false;
			}
			// Skip
			else {
				// Add one to the variable
				set(uniqueID,get(uniqueID) + 1);
				
				// Update the currentamount variable
				currentamount = get(uniqueID);

				return true;
			}
		// No variable made already
		} else {
			// Make the variable
			set(uniqueID, 0);
			// Add one to it
			set(uniqueID, get(uniqueID) + 1);
			
			// Update the currentamount variable
			currentamount = get(uniqueID);
			
			return true;
		}
	}
		
	// Count effect
	async function count(emoji, prefix, count_to, suffix, timeout, reversed) {
		for(let i = 0; i < count_to; i++) {
			let recalculated_count = reversed
				? count_to - i
				: i + 1;

			let final_string = prefix + recalculated_count + suffix;

			if(emoji != "random")
				await status(emoji, final_string);
			else
				await status(randomEmoji(), final_string);
			
			await wait(timeout);
		}

		return;
	}
		
	///////////////////////////////////////////////////
	//Main functions///////////////////////////////////

	const DISCORD_TOKEN = MANUAL_DISCORD_TOKEN.length > 0 
		? MANUAL_DISCORD_TOKEN
		: localStorage.token.slice(1, -1);

	const DISCORD_ENDPOINT = "https://discord.com/api/v9/users/@me/settings"; // Discord API user settings URL
	let ANIMATION_RUN = true;

	let status_text = "";
	let status_emoji = "";
	let status_state = "";

	// Source -> codespeedy.com/shuffle-characters-of-a-string-in-javascript/
	function shuffle(s) {
		const getRandomInt = n => Math.floor(Math.random() * n);
		
		var arr = s.split('');           // Convert String to array
		var n = arr.length;              // Length of the array
		
		for(var i = 0; i < n-1; ++i) {
			var j = getRandomInt(n);       // Get random of [0, n-1]
		
			var temp = arr[i];             // Swap arr[i] and arr[j]
			arr[i] = arr[j];
			arr[j] = temp;
		}
		
		s = arr.join('');                // Convert Array to string
		return s;		                 // Return shuffled string
	}

	//Function that changes the status variables (Saves up a bit space)
	async function status(emoji, text, state) {
		if(ANIMATION_RUN) {
			status_text = text;
			status_emoji = emoji;
			status_state = state;
			
			await setStatus();
			
			return;
		}
	}

	async function sendStatusRequest(bodyJSON) {
		const stringifiedBody = JSON.stringify(bodyJSON);

		if(typeof DISCORD_TOKEN != "string") {
			console.log("Invalid Discord token... Aborting!");
			ANIMATION_RUN = false;
			return false;
		}

		await fetch(DISCORD_ENDPOINT, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': DISCORD_TOKEN
			},
			body: stringifiedBody
			})
				.catch(() => {
					console.log("Failed to update status! Maybe your token is incorrect?");
				});
			
		return true;
	}

	// Function that handles the HTTP request for the status change
	async function setStatus() {
		await sendStatusRequest({
			"custom_status" : {
				"text" : status_text,
				"emoji_name" : status_emoji
			}
		});

		if(["invisible", "dnd", "idle", "online"].includes(status_state)) {
			await sendStatusRequest({
				"status" : status_state
			});
		}

		return true;
	}
		
	async function state(text) {
		if(ANIMATION_RUN) {
			if(["invisible", "dnd", "idle", "online"].includes(status_state)) {	
				status_state = text;
				
				await sendStatusRequest({
					"status" : status_state
				});
			}

			return true;
		}
	}
		
	async function emoji(emoji) {
		if(ANIMATION_RUN) {
			status_emoji = emoji;
			
			await sendStatusRequest({
				"custom_status" : {
					"emoji_name" : status_emoji
				}
			});
		
			return true;
		}
	}
		
	async function text(text) {
		if(ANIMATION_RUN) {
			status_text = text;

			await sendStatusRequest({
				"custom_status" : {
					"text" : status_text
				}
			});

			return true;
		}
	}

	(async () => {
		while(ANIMATION_RUN) {
			await loop();
		}
	})();

	// set default status before exiting
	window.onbeforeunload = function () {
		ANIMATION_RUN = false;
		
		status_text = DEFAULT_STATUS_TEXT;
		status_emoji = DEFAULT_STATUS_EMOJI;
		
		if(["invisible", "dnd", "idle", "online"].includes(status_state))
			status_state = DEFAULT_STATUS_STATE;
		
		setStatus();
		
		return true;
	};
})();
