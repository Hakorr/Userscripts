# AuxParty Farmer
A simple JS script to farm points (1 point/second)

## How does it work?

The bot needs you to have at least two accounts. 

* The account which will receive the points, will skip songs rapidly. (Default every 500ms)

* The other account(s) will vote the song rapidly. (Default every 100ms)

## How do I use it?

> **Before doing anything else, download and setup a HTTP request blocker.** AuxParty creates a playlist using your account everytime you add new songs to your queue. It also uses that playlist as an advertisement. This might lead to tens of playlist being created, which is really annoying. You need to block this URL ```api.soundcloud.com/me/playlists?format=json```.

I recommend using your browser's built in blocker. [See more for Chrome/Chromium](https://stackoverflow.com/questions/27863094/how-to-block-a-url-in-chromes-developer-tools-network-monitor) 

If using [HTTP Request Blocker](https://chrome.google.com/webstore/detail/http-request-blocker/eckpjmeijpoipmldfbckahppeonkoeko), use this pattern ```*://api.soundcloud.com/me/playlists?format=json/*```

*You need to do this only once, just for the points receiver.*

### Setting up a points receiver

1. Login with the account you want to receive points for.
2. Find **big** playlists and add them to the queue so you have a lot of songs there.
    * If you're using autoqueue, keep the playlist you want autoqueue to **open**. The bot will use the *"add all tracks to queue"* button.
3. Go to as a DJ.
4. Paste the script to your console and run it. This browser's account will now start skipping songs.

### Setting up a voter

1. Open an incognito window or a new browser.
2. Login with your secondary Spotify or Soundcloud account.
3. Go to the same lobby as your first receiver account.
4. Run the script again, but with the receiver variable set as false. This browser's account will now start voting the songs.

## Commands

*Using your browser's console, you can*

* Stop the script ```stop();```

* Start the script ```start();```

## Note

*I am not responsible for your actions nor anything that could happen.*

***This could be bannable, you've been warned.***
