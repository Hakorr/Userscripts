## Hakorr's userscripts

| Site | Name | Built with | Other |
|---|---|---|---|
| Aternos.com | [AntiAntiAdblock](https://github.com/Hakorr/Userscripts/tree/main/Aternos.com/AntiAntiAdblock) | [Violentmonkey](https://violentmonkey.github.io/) & Chromium | [Site](https://hakorr.github.io/Userscripts/Aternos/AntiAntiAdblock/) |

---

## Other

### Functions to copy paste

Some of them were modified by me.

---

###### Find an element by text
```js
const findByText = (selector,text) => Array.from(document.querySelectorAll(selector)).find(el => el.textContent === text);
```

###### Add CSS
```js
function addCSS(cssCode) {
var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssCode;
  } else {
    styleElement.appendChild(document.createTextNode(cssCode));
  }
  document.getElementsByTagName("head")[0].appendChild(styleElement);
}
```

###### Simple string sanitizer
```js
function sanitize(string) {
    const decoder = document.createElement('div')
    decoder.innerHTML = string;
    return decoder.textContent;
}
```

###### Get HTTP response text (outdated)
```js
function Get(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
```

###### Get HTTP response text
```js
async function Get(url) {
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let text = await response.text();
  return text;
}
```

###### Wildcard pattern matching
```js
const wildMatch = (str,item) => new RegExp('^' + str.replace(/\*/g, '.*') + '$').test(item);
```

###### Run script from Base64 encoded string
```js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js

/* 
-  Base64 encode your whole userscript's code and paste it to the code variable.
-  https://www.base64encode.org/ 
*/

(function () { "use strict";
    const code = atob("Y29uc29sZS5sb2coIkhlbGxvISIp");
    var s = document.createElement('script');
    document.arrive('body',function() {
        try {
            s.appendChild(document.createTextNode(code));
            document.body.appendChild(s);
        } catch (e) {
            s.text = code;
            document.body.appendChild(s);
        }
    });
})();
```

