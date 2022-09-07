## Methods to find & remove the fullscreen red warning

* *Note that they're probably all patched but should work with slight adjustments!*

* Some of the functions require JQuery!

---

#### Find by attribute
	
```js
function removeLayer() {
	Array.from(document.querySelectorAll("[style]")).forEach(elim => {
		if(elim.getAttribute("style").includes("top: 0;")) elim.style += "top: -1px"; 
	}); 
}

window.onload = function() { removeLayer() } 
```

---

#### Find by attribute #2
```js
function removeLayer() {
	Array.from(document.querySelectorAll("[style]")).forEach(elem => {
		//Change the top: 0 to some attribute the fullscreen red Anti-Adblock has, then it works
		if(elem.getAttribute("style").includes("top: 0")) {
			//What to do with the element, feel free to modify
			elem.innerHTML = ""; 
			elem.style += "display: none"; 
		}
	});
}

window.onload = function() { removeLayer() } 
```

---

#### Body element z-index over the fullscreen layer
```js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js

function removeLayer() {
  $(".body, .header").each(function () {
    this.setAttribute("style",`position: relative; z-index: ${"99999999999999999999999999999999999999999999999999999999999999999".repeat(69420)}`);
  });
}

window.onload = function() { removeLayer() } 
```

---

#### Find by text, go a couple parents above and remove the element
```js
function removeLayer() {
  const findByText = (selector,text) => Array.from(document.querySelectorAll(selector)).find(el => el.textContent === text);
  let antiadblockElem = findByText("*","You are using an adblocker!");
  //Adjust this to make it work
  antiadblockElem.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML = "";
}

window.onload = function() { removeLayer() } 
```

---

#### Remove all elements with attribute names over a certain amount
```js
function removeAttributesOver(attribute, len) {
    Array.from(document.querySelectorAll(attribute)).forEach(div => {
        Array.from(div.attributes).forEach(atr => {
            if(atr.name.length > len) div.remove();
        });
    });
}

function removeLayer() { 
    removeAttributesOver("div",9);
    removeAttributesOver("span",9);
}

window.onload = function() { removeLayer() } 
```

---

#### Remove elements from the bottom
```js
function removeFromBottom(amount) {
    for(let i = 0; i <  amount; i++) { 
        let lastStyle = document.querySelector("body").lastElementChild;
        if(lastStyle) lastStyle.remove();
    }
}

function removeLayer() { 
    removeFromBottom(12);
}

window.onload = function() { removeLayer() } 
```

---
