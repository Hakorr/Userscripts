# [Reddit] MassBlocker

Automatically block users that are shown on the page

![](https://raw.githubusercontent.com/Hakorr/Userscripts/main/Reddit.com/MassBlocker/src/example.gif)

## How to use

1. Install the userscript
2. Visit any page with usernames
3. Scroll or `CTRL + B` to scrape & block users
    * If you visit a post, use the shortcut instead of scrolling
4. Scraped users' usernames will show up as Red
5. Enjoy

**Pro-tip: Do not keep the script active, disable it when you don't use it.**

## Troubleshooting

### Doesn't show up

* Make sure to use new Reddit (don't use new.reddit.com or old Reddit)
* Enable message/alert/notification boxes for the site
* Try using a Chromium based browser
* Try using Violentmonkey

### No token found error

* Refresh the page multiple times
   * If that doesn't work, make a new issue

### Ratelimit

* Reddit has a strict ratelimit on the amount of blocked users a day, we cannot do anything about it.

## Limitations

#### Daily block limit (~50/day)

```json
{
    "explanation": "You've reached the daily block limit",
    "message": "Too Many Requests",
    "reason": "BLOCK_RATE_LIMIT"
}
```
## Dependecies

* [AttributeDeobfuscator](https://github.com/Hakorr/AttributeDeobfuscator)

## Note

Please keep in mind that I can't be held liable if your Reddit account faces any backlash from using this userscript.
