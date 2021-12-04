# Discord Status Animator
A **dead simple** manually editable status animator for Discord (Browser)

https://greasyfork.org/en/scripts/427960-discord-status-animator-manual-edit-non-ui

**This is a personal project, the code is not meant to be clean, the repo is public so I can share it with friends.**

## How to install?

* *Using the **Browser** version of Discord*
<details>
<summary>Open for instructions</summary><br>
 
1. Install [Violentmonkey](https://violentmonkey.github.io/) or similar.
2. Add the script manually or via [GreasyFork](https://www.greasyfork.org/en/scripts/427960-discord-status-animator-manual-edit-non-ui).
---
</details>

* *Using the **Desktop** version of Discord*
<details>
<summary>Open for instructions</summary><br>
  
  * You can add the script manually by opening the console with CTRL + SHIFT + I and pasting the script there.
 
Your status won't be cleared after you exit Discord.

---
</details>

* *Using the **Mobile** version of Discord*
<details>
<summary>Open for instructions</summary><br>
  
(**Currently not working, at least with this method of using userscripts on mobile. You can still try.**)
  
1. Install Firefox Nightly.
2. Go to the settings, scroll down to the last option "About Firefox Nightly".
3. Click the Firefox logo a couple times until you've unlocked the extra settings.
4. Go back to the settings, open the "Custom Add-on collection"
5. User ID `16914517` Collection name `Userscript-managers`
6. Install/Enable Violentmonkey or any of the other ones.
7. Tap the extension you just installed, go to its settings.
8. Add the Animator script manually by copy pasting, or go visit its [GreasyFork](https://greasyfork.org/en/scripts/427960-discord-status-animator-manual-edit-non-ui) while still using Firefox Nightly.
9. Use your Discord on your browser and see if it works.
 
*You could also try to use the script with [Tampermonkey's Android application](https://play.google.com/store/apps/details?id=net.biniok.tampermonkey).* 
 
---
</details>

## How to use?

Below, you can see all the animation "blocks" you can use to construct your "animation script". Manually edit the script's ```loop()``` function and construct your animation using the blocks. (Copy & paste a block, edit the values inside its parenthesis) 

*(See example animations at the bottom)*

## Current features

<details open>
<summary open>Animation blocks</summary><br>

Wait a selected amount of milliseconds before continuing to the next block
```js
await wait(ms);
```
Blank status - Doesn't touch the state, but will make the emoji and text blank
```js
await blank();
```
Set status's state - There are four options: invisible, dnd, idle and online
```js
await setstate("state");
```
Set status's emoji - This will clear the text
```js
await setemoji("emoji");
```
Set status's text - This will clear the emoji
```js
await settext("text");
```
Edit the status
```js
await status("emoji","text","state");
```
Skip - If you're using multiple skips on the same animation, make sure to use a different identifier for each one
```js
if(await skip(times,"identifier")) return;
```
Typewriter
```js
await typewriter("emoji","text",timeout,reversed);
```
Glitch - Randomizes a string multiple times
```js
await glitch("emoji","text",times,timeout);
```
Glitchtype - Typewriter + empty spaces are filled with glitch effect
```js
await glitchtype("emoji","text",timeout,glitch_rate,reversed);
```
Sentence - Automatically splits a sentence and updates the status one word at a time
```js
await sentence("emoji","text",timeout);
```
Blink - Blink x amount of times every x milliseconds
```js
await blink("emoji","text",timeout,times);
```
Count - Simply count from 1 -> X or if reversed then from X -> 1
```js
await count("emoji","prefix",count_to,"suffix",timeout,reversed);
```
Activity - Positive if user is on the Discord tab, negative if not
 ```js
 await activity("positive_emoji","positive_text","positive_state","negative_emoji","negative_text","negative_state");
 ```
Scroll - Move the text sideways - Center amount means how many times it will move the full text sideways
```js
await scroll("emoji","text",timeout,center_amount,reversed);
```
</details>

<details open>
<summary open>Variables</summary><br>
  
Gives a random number between min and max

```js
random_number(min,max)
```
Gives a random emoji
```js
random_emoji()
```
Gives the date and time - XX/XX/XX @ XX:XX:XX
```js
getDateTime()
```
Gives the exact time - XX:XX:XX
```js
getExactTime()
```
Gives the time - XX:XX
```js
getTime()
```
</details>

#### Examples

##### Do remember that Discord doesn't update your status as fast for others

<details open>
<summary>Animations</summary><br>

010101010101
```js
await glitch("","010101010101",2,1000);
```
You're fabulous
```js
await typewriter("","You're fabulous",250);
await typewriter("","You're fabulous",250,true);
await wait(5000);
```
Display your time
```js
await status("","My local time is " + getExactTime());
await wait(1000);
```
Advertisement (My personal script)
```js
await settext(getExactTime());
await wait(1000);

if(await skip(10,"unique")) return;
  
await typewriter("","github.com/Hakorr",50);
await wait(3000);

await activity("","Am I currently on the Discord tab: Yes","","","Am I currently on the Discord tab: No","");
await wait(2000);

await glitch("","0̴͕̰͙̈́:̴̞̊͆͒ͅ0̷͈̇ͅ0̷̧̺͆̇:̴̞̊͆͒ͅ0̷͈̇ͅ0̷̧̺͆̇",5,25);

await glitchtype("",getExactTime(),25,1);
```
Stage test
```js
await blink("🟦","Stage 1",500,1);

if(await skip(3,"unique")) return;

await blink("🟩","Stage 2",500,1);

if(await skip(3,"unique2")) return;

await blink("🟪","Stage 3",500,1);

if(await skip(2,"unique")) return;

await blink("🟧","Stage 4",500,1);
```
Activity
```js
await activity("","I am active","online","","I am not active","dnd");
await wait(500);
```
</details>

## Todo

* New effects(?)

## ⚠️Warning

* The script creates a cookie with your Discord token. This cookie could help bad authors to get your token.
* Do not share the cookie with anyone, as it's your Discord token which can be used to do anything.

*Protip: If your token has been stolen, change your password, it will reset it.*

*The author is not responsible for any harm caused by this script.*
