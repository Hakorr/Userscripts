# [Reddit] MassBlocker

Automatically block users that are shown on the page

## How to use

1. Install userscript
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
