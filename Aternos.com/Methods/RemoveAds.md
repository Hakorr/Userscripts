## Methods to remove the empty ad elements

(Those not removed by adblockers)

---

#### Find all ad elements and remove them

```js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js

$(document).ready(function () {
    Array.from($(".ad")).forEach(ad => ad.setAttribute("style","display: none;")); 
    document.querySelector(".sidebar").setAttribute("style","display: none;");
});
```

---
