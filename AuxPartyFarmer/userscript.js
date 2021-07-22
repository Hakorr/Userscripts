////////////////////////////////////////
/* Simple points bot for AuxParty.com */
////////////////////////////////////////

//True for the account you want to give points
var receiver = true;

//Automatically press "add all tracks to queue"
var autoqueue = true;

//Automatically go as a DJ if thrown out
var automaticdj = true;

//In milliseconds
var receiver_wait = 1000;
var voter_wait = 100;

////////////////////////////////////////////////////////
/* Do not proceed if you don't know what you're doing */
////////////////////////////////////////////////////////

var fire = document.querySelector('[aria-label="🔥, fire"');
var rock = document.querySelector('[aria-label="🤘, the_horns, sign_of_the_horns"');
var heart = document.querySelector('[aria-label="💖, sparkling_heart"');
var clap = document.querySelector('[aria-label="👏, clap"');
var skip = document.querySelector('[aria-label="⏭️, black_right_pointing_double_triangle_with_vertical_bar"');

var options = [fire, rock, heart, clap, skip];

var proceed = true;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function stop() {
	proceed = false;
}

function start() {
	proceed = true;
}

function wait(t) {
	return new Promise(function(resolve) {
		setTimeout(resolve, t)
	});
}

async function addtracks() {
		var elems = document.querySelectorAll("*"),
		res = Array.from(elems).find(v => v.textContent == 'add all tracks to queue');
		if(res) res.childNodes[0].click();
}

async function autodj() {
	while(proceed) {
		var elems = document.querySelectorAll("*"),
		stopdj = Array.from(elems).find(v => v.textContent == 'Stop DJing');
		startdj = Array.from(elems).find(v => v.textContent == 'Start DJing');
		if(!stopdj) {
			if(autoqueue) await addtracks();
			startdj.childNodes[0].click();
		}
		await wait(100);
	}
}


async function main() {
	while(proceed) {
		if(receiver) {
			skip.click();
			await wait(receiver_wait);
		}
		else {
			options[randomInt(0,3)].click();
			await wait(voter_wait);
		} 
	}
}

if(receiver & automaticdj) autodj();
main();
