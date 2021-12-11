## Functions & other stuff taken from the internet

Some of them are modified by me.

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

###### Wildcard pattern matching
```js
const wildMatch = (str,item) => new RegExp('^' + str.replace(/\*/g, '.*') + '$').test(item);
```
