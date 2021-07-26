## Functions & other stuff taken from the internet

###### Find an element by text
```js
function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function(element){
    return RegExp(text).test(element.textContent);
  });
}
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

###### Get HTTP response text
```js
function Get(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
```

###### Multiline variable
```
var name = `

`;
```
