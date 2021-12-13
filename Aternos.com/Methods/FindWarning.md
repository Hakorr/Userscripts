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
```

---

#### Find by attribute #2
```js
Array.from(document.querySelectorAll("[style]")).forEach(elem => {
    //Change the top: 0 to some attribute the fullscreen red Anti-Adblock has, then it works
    if(elem.getAttribute("style").includes("top: 0")) {
        //What to do with the element, feel free to modify
        elem.innerHTML = ""; 
        elem.style += "display: none"; 
    }
});
```

---

#### Body element z-index over the fullscreen layer
```js
function removeLayer() {
  $(".body, .header").each(function () {
    this.setAttribute("style",`position: relative; z-index: ${"99999999999999999999999999999999999999999999999999999999999999999".repeat(69420)}`);
  });
}
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
```

---

#### Remove all elements with attribute names over a certain amount
```js
function removeAttributesOver(attribute, length) {
    Array.from(document.querySelectorAll(attribute)).forEach(div => {
        Array.from(div.attributes).forEach(atr => {
            if(atr.name.length > 9) div.remove();
        });
    });
}

function removeLayer() { 
    removeAttributesOver("div",9);
    removeAttributesOver("span",9);
}
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
```

---

#### Find the element ID from the blocked Base64 script
```js
e.target.getAttribute("src").split("data:text/javascript;base64,").forEach(str => {
    //If the string is Base64
    if(isBase64(str)) {
	//Decode the Base64 string
	let beforeScriptExecute = atob(str);

	beforeScriptExecute.split(" ").forEach(x => {
	    //_0x4c04= is a variable name inside the Base64 encoded JavaScript file
	    //The name has been changed, please edit this.
	    if(x.includes("_0x4c04=")) {
		x.split("'").forEach(x => {
		    if(x.includes("#")) {
			if(x.length != 0 && $(x)) $(x)[0].innerHTML = "";
		    }
		})
	    } 
	})
    }
});
```

---
