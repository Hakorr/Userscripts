## Methods to fix the buttons

* *Note that they're probably all patched but should work with slight adjustments!*

* Some of the functions require JQuery!

---

#### Aternos' own method

```js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js

$(document).ready(function () {
    //Added from the "Continue with adblocker anyway" button's function
    $(".body, .header").each(function () {
        this.style.setProperty("display", "");
        this.style.setProperty("height", "");
    });
    //Added from the "Continue with adblocker anyway" button's function
    $("#start").each(function () {
        this._ready = true;
    });
    $("#userdropdown-toggle").click(function (e) {
        if ($(window).width() <= 1e3) {
        e.preventDefault();
        $(".userdropdown").slideToggle(100);
        }
    });
    $(".logout").click(function () {
        aget("/panel/ajax/account/logout.php", function () {
        location.href = "/go/";
        });
    });
    $(".navigation-toggle").click(function () {
        var cookieValue = 0;
        if ($(".navigation").hasClass("toggled")) {
        $(".navigation").removeClass("toggled");
        } else {
        $(".navigation").addClass("toggled");
        cookieValue = 1;
        }
        document.cookie = COOKIE_PREFIX + "_NAVIGATION_TOGGLED=" + cookieValue + ";path=/;max-age=31536000";
    });
    $(".friend-access-count-dropdown").click(function () {
        var dropdown = $(".friend-access-dropdown");
        if (dropdown.css("display") === "none") {
        dropdown.slideDown(100);
        $(".friend-access-count-dropdown i").fa("fas", "fa-caret-up");
        } else {
        dropdown.slideUp(100);
        $(".friend-access-count-dropdown i").fa("fas", "fa-caret-down");
        }
    });
    $(".js-friends-access").click(friendAccess);
    $(".js-friends-leave").click(friendLeave);
    $(".hamburger").click(function () {
        if ($(".navigation").css("left") == "-200px") {
        $(".navigation").animate({left: "0px"});
        } else {
        $(".navigation").animate({left: "-200px"});
        }
    });
});
```

---

#### My old method

* This doesn't include every button, but the major ones.

```js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js

//Found the advertisement element on document -> Hide all the nondeleted advertisement elements
document.arrive('.ad', function () { 
    Array.from(document.querySelectorAll(".ad")).forEach(ad => ad.setAttribute("style","display: none;")); 
});

//Found the start button on document -> Patch the start button (To make it functional)
document.arrive('#start', function () { 
    document.querySelector("#start").onclick = function() {
        start();
    }
});

//Found the navigation open/close button on document -> Patch the navigation open/close button (To make it functional)
document.arrive('.navigation-toggle', function () { 
    document.querySelector(".navigation-toggle").onclick = function(){
        let nav = document.querySelector(".navigation"); 
        nav.setAttribute("class", nav.getAttribute("class") == "navigation" ? "navigation toggled" : "navigation");
    }
});
```
