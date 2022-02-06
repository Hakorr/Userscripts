# [Reddit] AttributeDeobfuscator

Gives the ability to turn the original attribute names into the obfuscated/randomized ones and vice versa.

## Moved

Please visit the new repo [here](https://github.com/Hakorr/AttributeDeobfuscator).

## How does it work?

The randomized element class names are usually inside functions, such as the one below...

```js
"./src/reddit/components/UserIcon/UserIcon.m.less": function (e, t, r) {
	e.exports = {
		currentUserIconWrapper: "efdkOLo3oigH_95whTYCp",
		userIconWrapper: "_2p14AQvJBvTrEEa4csiW9v",
		isProfileIcon: "_1lxVpLf3223Gve3gRhbG-R",
		DefaultUserIcon: "_3utuhrSAkEkzgaswqglvpN",
		defaultUserIcon: "_3utuhrSAkEkzgaswqglvpN",
		UserIcon: "_2TN8dEgAQbSyKntWpSPYM7",
		userIcon: "_2TN8dEgAQbSyKntWpSPYM7",
		mNightmode: "_2aVSEFJsIE0M-4uRE-U24H",
		nftAnimation: "_3fhlcUDP9SJN47QMfuzW_j",
		snoovatarWrapper: "_1cyAeeYDGrx7MPL_jRwKZ",
		snoovatarBackground: "_2_QqG5dG916znjlVV8ZCbw",
		snoovatarHeadshotContainer: "_1XJXnCAngvZLEeLpB3oa4L",
		snoovatarHeadshot: "ScrrUjzznpAqm92uwgnvO",
		presenceDot: "_2dn5Ncenn0BSD4tCSmxQhA",
		isLit: "GpWjjkZl5_kV4yZYWBaT2",
		hasHeadShotWrapper: "_1TENjLYSaj4L4uJMZa3DRe"
	}
},
```

So generally, the code around the values will look this...

```js
"./src/reddit/x/y/z.m.less": function (a, b, c) {
	e.exports = {
		name: "randomizedName"
	}
}
```

The functions which contain these values, are located in various JavaScript files loaded at the start of the document.
- https://www.redditstatic.com/desktop2x/CommentsPage.xxx.js
- https://www.redditstatic.com/desktop2x/Governance~ModListing~Reddit~Subreddit.xxx.js
- https://www.redditstatic.com/desktop2x/Reddit~StandalonePostPage~reddit-components-ClassicPost~reddit-components-CompactPost~reddit-compone~xxx.js

etc...

What the userscript does, is fetch each and every one of these files, extract the exports and push them into an array.
* You can view an example array [here](https://github.com/Hakorr/Userscripts/blob/main/Reddit.com/AttributeDeobfuscator/list.json).

From that array, you can extract the obfuscated/randomized name by inputting the regular name. This way, you can basically write userscripts to modify the document. Have fun!

## Todo

* It could possibly be more suitable to fetch the JS files from an array of set URLs. That would allow the script to function faster, rather than waiting the whole page to load. Currently any changes to the document will have to wait until the whole page has loaded, which may look glitchy to the end user.

## Important

* Do not use the userscript to cause any harm to other users.
