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

## Limitations

#### Daily block limit (~50/day)

```json
{
    "explanation": "You've reached the daily block limit",
    "message": "Too Many Requests",
    "reason": "BLOCK_RATE_LIMIT"
}
```

## Note

Please keep in mind that I can't be held liable if your Reddit account faces any backlash from using this userscript.
