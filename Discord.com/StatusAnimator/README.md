# [[Discord] Status Animator](https://greasyfork.org/en/scripts/427960-discord-status-animator-manual-edit-non-ui)
A **dead simple** manually editable status animator for Discord (Browser)

## Installation

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
  
  * Not supported
---
</details>

* *Using the **Mobile** version of Discord*
<details>
<summary>Open for instructions</summary><br>
  
### Method 1
 
1. Install the [Kiwi Browser](https://kiwibrowser.com/).
2. Add the userscript manager of your choice from Google's Extension Store.
3. Add the Animator script manually by copy pasting, or go visit its [GreasyFork](https://greasyfork.org/en/scripts/427960-discord-status-animator-manual-edit-non-ui).
4. Open Discord on the browser, and enjoy!
 
### Method 2
 
1. Install Firefox Nightly.
2. Go to the settings, scroll down to the last option "About Firefox Nightly".
3. Click the Firefox logo a couple times until you've unlocked the extra settings.
4. Go back to the settings, open the "Custom Add-on collection"
5. User ID `16914517` Collection name `Userscript-managers`
6. Install/Enable Violentmonkey or any of the other ones.
7. Tap the extension you just installed, go to its settings.
8. Add the Animator script manually by copy pasting, or go visit its [GreasyFork](https://greasyfork.org/en/scripts/427960-discord-status-animator-manual-edit-non-ui) while still using Firefox Nightly.
9. Use your Discord on your browser and see if it works.

---
</details>

## How to use?

https://user-images.githubusercontent.com/76921756/172626482-d3119183-9e9e-465b-8faa-e454a092c209.mp4

Background music by [Prod. Riddiman](https://www.youtube.com/channel/UCdSuKogXJOZld5Dzw_9285w).

---

Below, you can see all the animation "blocks" you can use to construct your "animation script". Manually edit the script's ```loop()``` function and construct your animation using the blocks. (Copy & paste a block, edit the values inside its parenthesis) 

## Animation Blocks

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
await state("state");
```
Set status's emoji - This will clear the text
```js
await emoji("emoji");
```
Set status's text - This will clear the emoji
```js
await text("text");
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
randomNumber(min,max)
```
Gives a random emoji
```js
randomEmoji()
```
Gives the date and time - XX/XX/XX @ XX:XX:XX
```js
getTime("full")
```
Gives the exact time - XX:XX:XX
```js
getTime("exact")
```
Gives the time - XX:XX
```js
getTime()
```
</details>

#### Examples

Do remember that Discord doesn't update your status as fast for others. Many of the examples you see here do not show up to others. Please slow them down if you want others to properly see every change.

<details open>
<summary>Animations</summary><br>

010101010101
```js
await glitch("","010101010101", 2, 1000);
```
You're fabulous
```js
await typewriter("", "You're fabulous", 250);
await typewriter("", "You're fabulous", 250, true);
await wait(5000);
```
Display your time
```js
await status("", "My local time is " + getTime("exact"));
await wait(1000);
```
Random advertisement
```js
await text(getTime("exact"));
await wait(1000);

if(await skip(10,"unique")) return;
  
await typewriter("", "github.com/Hakorr", 50);
await wait(3000);

await activity("", "Am I currently on the Discord tab: Yes", "", "", "Am I currently on the Discord tab: No", "");
await wait(2000);

await glitch("", "0̴͕̰͙̈́:̴̞̊͆͒ͅ0̷͈̇ͅ0̷̧̺͆̇:̴̞̊͆͒ͅ0̷͈̇ͅ0̷̧̺͆̇", 5, 25);

await glitchtype("", getTime("exact"), 25, 1);
```
Stage test
```js
await blink("🟦", "Stage 1", 500, 1);

if(await skip(3, "unique")) return;

await blink("🟩", "Stage 2", 500, 1);

if(await skip(3,"unique2")) return;

await blink("🟪", "Stage 3", 500, 1);

if(await skip(2, "unique3")) return;

await blink("🟧", "Stage 4", 500,1 );
```
Activity
```js
await activity("", "I am active","online", "", "I am not active", "dnd");
await wait(500);
```
</details>

*The author is not responsible for any harm caused by this script.*
