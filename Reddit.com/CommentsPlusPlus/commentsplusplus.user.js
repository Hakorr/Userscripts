// ==UserScript==
// @name        [Reddit] Comments++
// @namespace   HKR
// @match       https://*.reddit.com/r/*/comments/
// @exclude     https://*.reddit.com/r/*/comments/*after*
// @exclude     https://*.reddit.com/r/*/comments/*before*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @grant       GM_notification
// @version     1.0.0
// @author      HKR
// @description Enables a live-feed for subreddit comments, and many various other things!
// @run-at      document-load
// ==/UserScript==

/*
    [WARNING]
    -> DO NOT ONLY rely on this script to do your duties, the script does not promise to be accurate.
    -> I haven't had the time to test for every edge case. The custom comment UI probably has millions.
    -> There are bugs and errors, which may for example: cause the feed not to update properly or show incorrect data on various places.
    -> Please report any bugs to the Github issues!

    [WELCOME]
    -> This script is meant for moderators of very active subreddits, who need to check every single comment during their shift.
    -> You can find settings below. Don't be frightened by editing code, it won't break if you read my instructions carefully.
    -> If you're a developer, please don't judge. This project was taking too long and I wanted to finish it quickly. (Also, little to no commenting, sorry to you and my future self)
    -> Enjoy!

    [FEATURES]
    [+] Live subreddit comment feed
    [+] Adds a visible marker to the feed to indicate where you left after changing tabs
    [+] Image links shown as actual images
    [+] Calculates and tells the moderator their optimal break time
    [+] Comments automatically update on hover
    [+] Keep track on how many comments the moderator has seen
    [+] Improved comment UI, less clutter, better visibility
    [+] Dark theme for less strain on your eyes
    [+] New comment notifications/sounds
    [+] Load more comments button, no need to switch pages
    [+] Hide Reddit sidebar and other Reddit UI to bring focus to the comments
    [+] Easy language translate button
    [+] Ability to see deleted content after the user has deleted the comment
    [+] Various other changes and improvements

    [DRAWBACKS]
    [-] No Old Reddit comment UI
    [-] The Toolbox (browser extension) "user notes button" doesn't work
*/

/*//////////////////////////////////////////
//////////// [SETTINGS SECTION] ////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// [Add Toolbox buttons to comments]
// Default: false
const toolboxActive = false;

// [Is darkmode actived or not]
// Default: false
const uiDarkmodeActivated = false;

// [In which interval do you want to check for new comments]
// Default: 1000 (milliseconds) (...meaning; check for new comments every second)
const updateRateMs = 1000;

// [Each comment's timestamp is updated every x milliseconds]
// Default 5000
const timestampUpdateRateMs = 5000;

// [How long you need to hover a comment before it's marked as seen]
// Default: 0
const msBeforeCommentMarkedAsSeen = 0;

// [How many comments are loaded when you open the page]
// Default: 25
const startCommentAmount = 25;

// [How many old comments are loaded when you press the load more button]
// Default: 25
const loadMoreCommentsAmount = 25;

// [How many comments are you willing to let go unmonitored during your break]
// Default: 10 (comments) (...meaning; after your break of x time, 10 new posts will have been posted)
const breakPostThreshold = 10;

// [How many recent comments are fetched for calculating the average time between comments]
// Default: 100 (comments) (...meaning; the average time before a new comment is calculated using 100 comments and their post time differences)
const breakDatasetSize = 100;

// [Do you want to hide the old Reddit header]
// Default: true
const hideRedditHeader = true;

// [Do you want to hide the old Reddit sidebar]
// Default: true
const hideRedditSidebar = true;

// [Get notifications of new comments]
// Default: false
const commentNotifications = false;

// [Play a either a villager's sound or text-to-speech for new comments]
// Default: false
const commentAudioEffect = false;
    // [Use a Minecraft villager's sound effect instead of TTS]
    // Default: false
    const useVillager = false;
    // [Play only on removed, reported comments, etc]
    // Default: false
    const onlyOnViolatingComments = false;
    // [Only play the audio when tabbed out]
    // Default: true
    const onlyTabbedOut = true;

// DO NOT ENTER ZONE - DO NOT PROCEED IF YOU DON'T KNOW WHAT TO DO //
/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
/////////////////////////////////////////////////////////////////////
// DO NOT ENTER ZONE - DO NOT PROCEED IF YOU DON'T KNOW WHAT TO DO //

const isOldReddit = typeof r != 'undefined';
const isTopWindow = window == window.top;

// At the time of making this script, the subreddit comment page is only available in old Reddit.
// The script wouldn't function on new Reddit, therefore we have to stop execution if it's new Reddit.
if(!isOldReddit || !isTopWindow) {
    alert(`[Comments++] Failed to find old Reddit data objects, cannot continue. Are you using old Reddit?`);
    return;
}

const modHash = r.config.modhash;
const voteHash = r.config.vote_hash;
const currentSubreddit = r.config.post_site;

const seenCommentsDatabaseKey = 'seenComments_r_' + currentSubreddit;

const average = array => array.reduce((a, b) => a + b) / array.length;

const contentElem = document.querySelector('.content[role="main"]');
const commentTableElem = document.querySelector('#siteTable');
const getCommentElems = (doc) => [...doc.querySelectorAll('[data-type="comment"]')];

const subredditURL = 'https://www.reddit.com/r/' + currentSubreddit;
const commentsURL = subredditURL + '/comments';
const logURL = subredditURL + '/about/log';

const commentsJsonURL = numOfComments => `${commentsURL}/.json?limit=${numOfComments}&raw_json=1`;
const commentsBeforeJsonURL = (fullname, numOfComments) => `${commentsURL}/.json?before=${fullname}&limit=${numOfComments}&raw_json=1`;
const commentsAfterJsonURL = (fullname, numOfComments) => `${commentsURL}/.json?after=${fullname}&limit=${numOfComments}&raw_json=1`;

const commentJsonURL = fullname => `${subredditURL}/api/info.json?id=${fullname}&raw_json=1`;

const automodLogURL = `${logURL}/.json?mod=AutoModerator&limit=500&raw_json=1`;
const modActionLogURL = actionType => `${logURL}/.json?type=${actionType}&limit=500&raw_json=1`;

let waitingForNextPanelUpdate = false;
let updateControlPanel = () => { /* Not set yet */ };

const getNewRedditBody = obj => Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');

let pageActive = true;

document.addEventListener('visibilitychange', e=>{
    if (document.visibilityState === 'visible') {
        pageActive = true;
    } else {
        pageActive = false;
    }
});

function createCommentDataObj(commentData) {
    return {
        'author': {
            'name': commentData.author,
            'id': commentData.author_fullname,
            'distinction': commentData.distinguished
        },
        'subreddit': {
            'name': commentData.subreddit,
            'prefixed': commentData.subreddit_name_prefixed,
            'id': commentData.subreddit_id,
            'type': commentData.subreddit_type
        },
        'parent': {
            'title': commentData.link_title,
            'permalink': commentData.link_permalink,
            'fullname': commentData.parent_id
        },
        'body': commentData.body,
        'body_html': commentData.body_html,
        'gildings': commentData.gilded,
        'id': commentData.id,
        'fullname': commentData.name,
        'permalink': commentData.permalink,
        'created': commentData.created_utc,
        'removed': commentData.removed,
        'spam': commentData.spam,
        'locked': commentData.locked,
        'reports': commentData.mod_reports,
        'approved': {
            'by': commentData.approved_by,
        },
        'banned': {
            'by': commentData.banned_by,
            'note': commentData.ban_note
        }
    }
};

function weakSanitize(str) {
    /* This method might have flaws: https://security.stackexchange.com/a/34114
    - The flaws don't matter that much, since even if this could be bypassed,
    the malicious string couldn't do much due to what strings, or how the strings are used. (This is more of a last resort)*/

    return str.replace(/\&/g, '&amp;')
        .replace(/\</g, '&lt;')
        .replace(/\>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/\'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Returns a human readable string of time from inputted seconds
function secondsToReadableForm(totalSeconds) {
    totalSeconds = totalSeconds.toFixed(0);

    const years = Math.floor(totalSeconds / (60 * 60 * 24 * 30 * 12)) % 365;
    const months = Math.floor(totalSeconds / (60 * 60 * 24 * 30)) % 12;
    const days = Math.floor(totalSeconds / (60 * 60 * 24)) % 30;
    const hours = Math.floor(totalSeconds / 60 / 60) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    const readableFormObj = {};

    if(years) readableFormObj.year = years;
    if(months) readableFormObj.month = months;
    if(days) readableFormObj.day = days;
    if(hours) readableFormObj.hour = hours;
    if(minutes) readableFormObj.minute = minutes;
    if(seconds) readableFormObj.second = seconds;

    let finalReadableForm = '';

    Object.keys(readableFormObj).forEach((key, i) => {
        const isLastItem = i == Object.keys(readableFormObj).length - 1;
        const isFirstItem = i == 0;

        let prefix = '';

        if (isLastItem && !isFirstItem) {
            prefix = ' and ';
        } else if(!isFirstItem) {
            prefix = ' ';
        }

        const value = readableFormObj[key];

        finalReadableForm += `${prefix}${value} ${key + (value > 1 ? 's' : '')}`;
    });

    return finalReadableForm;
}

function simpleSecondsToReadableForm(seconds) {
    const ms_Min = 60,
          ms_Hour = ms_Min * 60,
          ms_Day = ms_Hour * 24,
          ms_Mon = ms_Day * 30,
          ms_Yr = ms_Day * 365;

    if(seconds < 10)
        return 'just now';

    else if (seconds < ms_Min)
        return Math.round(seconds) + ' seconds ago';

    else if (seconds < ms_Hour)
        return Math.round(seconds / ms_Min) + ' minutes ago';

    else if (seconds < ms_Day)
        return Math.round(seconds / ms_Hour) + ' hours ago';

    else if (seconds < ms_Mon)
        return 'Around ' + Math.round(seconds / ms_Day) + ' days ago';

    else if (seconds < ms_Yr)
        return 'Around ' + Math.round(seconds / ms_Mon) + ' months ago';

    else
        return 'Around ' + Math.round(seconds / ms_Yr) + ' years ago';
}

const toast = {
    'create': (type, icon, content, duration) => {
        let toastContainer = document.querySelector('#cpp-toast-container');
        let fadeTime = 500;

        if(!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'cpp-toast-container';

            document.body.appendChild(toastContainer);
        }

        const toastElem = document.createElement('div');
            toastElem.classList.add('cpp-toast');
            toastElem.style = `
                -webkit-animation: fadein ${fadeTime / 1000}s, fadeout ${fadeTime / 1000}s ${duration / 1000}s forwards;
                animation: fadein ${fadeTime / 1000}s, fadeout ${fadeTime / 1000}s ${duration / 1000}s forwards;
            `;

        const closeBtn = document.createElement('div');
            closeBtn.classList.add(`cpp-toast-${type}`);
            closeBtn.classList.add('cpp-toast-close-btn');
            closeBtn.innerHTML = `<div class="cpp-toast-close-btn-icon bi-x"></div>`;
            closeBtn.onclick = () => toastElem.remove();

        const iconElem = document.createElement('div');
            iconElem.classList.add('cpp-toast-icon');

        const emojiRegex = /\p{Emoji}/u;

        if(emojiRegex.test(icon)) {
            // emoji
            iconElem.innerText = icon;
        } else {
            // icon
            iconElem.classList.add(icon);
        }

        const contentElem = document.createElement('div');
            contentElem.classList.add('cpp-toast-content');
            contentElem.innerText = content;

        toastElem.appendChild(closeBtn);
        toastElem.appendChild(iconElem);
        toastElem.appendChild(contentElem);

        toastContainer.prepend(toastElem);

        setTimeout(() => toastElem.remove(), duration + fadeTime);
    },
    'success': (content, duration) => toast.create('success', 'bi-emoji-laughing-fill', content, duration),
    'message': (content, duration) => toast.create('message', 'bi-info', content, duration),
    'warning': (content, duration) => toast.create('warning', 'bi-exclamation', content, duration),
    'error': (content, duration) => toast.create('error', 'bi-exclamation-triangle-fill', content, duration)
};

const databaseHelpers = {
    'array': {
        'doesValueExist': (name, val) => GM_getValue(name)?.includes(val),
        'addValue': (name, val) => {
            const data = GM_getValue(name);

            if(data) {
                GM_setValue(name, [...GM_getValue(name), val]);
            } else {
                GM_setValue(name, [val]);
            }
        },
        'removeValue': (name, val) => {
            const data = GM_getValue(name);

            if(data) {
                GM_setValue(name, data.filter(x => x != val));
            }
        },
        'toggleValue': (name, val) => {
            const this_ = databaseHelpers.array;

            if(this_.doesValueExist(name, val)) {
                this_.removeValue(name, val);
            } else {
                this_.addValue(name, val);
            }
        }
    }
};

// Calculates how long of a break the moderator can take until x amount of comments are made
async function getBreakLength(threshold) {
    const commentsJSON = await fetch(commentsJsonURL(breakDatasetSize), {cache: 'no-store'})
        .then(res => res.json())
        .catch(err => console.log(err));

    if(commentsJSON) {
        const commentsArr = commentsJSON.data.children;
        const tempArr = [];

        commentsArr.forEach((comment, i) => {
            const commentTime = comment.data.created_utc;
            const nextCommentTime = commentsArr[i + 1]?.data.created_utc;

            const timeDifference = commentTime - nextCommentTime;

            if(timeDifference) {
                tempArr.push(timeDifference / 60);
            }
        });

        // break time in minutes
        const breakMinutes = average(tempArr) * threshold;
        const readableForm = secondsToReadableForm(breakMinutes * 60);

        return readableForm;
    }
}

async function postCommentAction(endpoint, bodyObj, stateObj) {
    try {
      const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: getNewRedditBody(bodyObj),
          cache: 'no-store'
      });

      if (res.status >= 200 && res.status <= 299) {
          const jsonRes = await res.json();

          if(jsonRes) {
              if(jsonRes?.success == false) toast.error(`${stateObj.requestFailed} Are you logged in?`, 1e4);
              else {
                  console.log(stateObj.requestSuccessful);

                  return jsonRes;
              }
          }
      } else {
          toast.error(`${stateObj.requestFailed} (${res.status}${res.statusText ? ' ' + res.statusText : ''})`, 1e4);
      }
    } catch(err) {
        toast.error(`${stateObj.unknownFailure} (${err.message})`, 1e4);
    }

    return false;
}

async function getCommentData(endpoint, errorMessage) {
    const res = await fetch(endpoint, {cache: 'no-store'})
        .then(res => res.json())
        .catch(err => toast.error(errorMessage, 3e3));

    if(res?.message && res?.error) {
        toast.error(`${errorMessage} (${res.error} - ${res.message})`, 1e3);
    } else {
        return res;
    }

    return false;
}

function createActionContainer(title, className, iconClass, detailArr) {
    if(typeof detailArr != 'object') {
        detailArr = [detailArr];
    }

    const commentActionContainer = document.createElement('div');
        commentActionContainer.classList.add(className);
        commentActionContainer.innerHTML = `
            <div class="cpp-comment-action-icon ${iconClass}"></div>
            <div class="cpp-comment-action-details">
                <div class="cpp-comment-action-details-title">${title}</div>
            </div>
        `;

    const actionDetailsContainer = commentActionContainer.querySelector('.cpp-comment-action-details');

    detailArr.forEach(detail => {
        const detailText = document.createElement('p');
            detailText.classList.add('cpp-comment-action-detail');
            detailText.innerText = detail;

        actionDetailsContainer.appendChild(detailText);
    });

    return commentActionContainer;
}

async function createBetterActionDetails(highlightClass, commentData, commentContentContainer, specificAction) {
    // Don't question this code, I didn't question my sanity either
    // Actually, while I am here, don't question any of the code seen on this userscript
    // I'm tired, I want to finish this project before the new year of 2023

    if(commentData.banned.by == true) {
       return `Reddit: ${commentData.banned.note}`;
    }

    else if(commentData.banned.by == 'AutoModerator') {
        console.log(commentData);
        const betterActionReason = await commentActions.getBetterActionReason(commentData.fullname, 'AutoModerator');

        if(betterActionReason)  {
            highlightText(highlightClass, commentContentContainer, betterActionReason);

            return `AutoModerator: ${betterActionReason.rule}`;
        }
    }

    else if(specificAction) {
        const betterActionReason = await commentActions.getBetterActionReason(commentData.fullname, null, specificAction);

        if(betterActionReason)  {
            return `${betterActionReason.mod}: ${betterActionReason.action}`;
        }
    }

    else if(commentData.banned.by == null) {
        const betterActionReason = await commentActions.getBetterActionReason(commentData.fullname);

        if(betterActionReason)  {
            return `${betterActionReason.mod}: ${betterActionReason.action}`;
        }
    }

    else {
        return `${commentData.banned.by}: ${commentData.banned.note}`;
    }
}

const commentActions = {
    'approve': {
        'sendRequest': async id => await postCommentAction('https://www.reddit.com/api/approve', {
            'id': id,
            'r': currentSubreddit,
            'uh': modHash,
            'renderstyle': 'html'
        }, {
            'requestSuccessful': 'Approved a comment!',
            'requestFailed': 'Failed to approve the comment!',
            'unknownFailure': 'Something went wrong while approving the comment!'
        }),
        'updateElem': async (commentElem, commentData, commentContentContainer, commentActionsContainer) => {
            commentElem.classList.add('cpp-comment-approved');
        }
    },
    'remove': {
        'sendRequest': async id => await postCommentAction('https://www.reddit.com/api/remove', {
            'id': id,
            'r': currentSubreddit,
            'spam': false,
            'uh': modHash,
            'renderstyle': 'html'
        }, {
            'requestSuccessful': 'Removed a comment!',
            'requestFailed': 'Failed to remove the comment!',
            'unknownFailure': 'Something went wrong while removing the comment!'
        }),
        'updateElem': async (commentElem, commentData, commentContentContainer, commentActionsContainer) => {
            const betterDetails = await createBetterActionDetails('cpp-remove-highlight', commentData, commentContentContainer);

            if(commentData.spam) {
                commentElem.classList.add('cpp-comment-spammed');
                commentActionsContainer.appendChild(createActionContainer('Spammed', 'cpp-comment-action-removal', 'bi-trash2', betterDetails));
            } else {
                commentElem.classList.add('cpp-comment-removed');
                commentActionsContainer.appendChild(createActionContainer('Removed', 'cpp-comment-action-removal', 'bi-x-lg', betterDetails));
            }
        }
    },
    'spam': async id => await postCommentAction('https://www.reddit.com/api/remove', {
            'id': id,
            'r': currentSubreddit,
            'spam': true,
            'uh': modHash,
            'renderstyle': 'html'
        }, {
            'requestSuccessful': 'Marked a comment as spam!',
            'requestFailed': 'Failed to mark the comment as spam!',
            'unknownFailure': 'Something went wrong while marking the comment as spam!'
        }),
    'lock': {
        'sendRequest': async id => await postCommentAction('https://www.reddit.com/api/lock', {
            'id': id,
            'r': currentSubreddit,
            'uh': modHash,
            'renderstyle': 'html'
        }, {
            'requestSuccessful': 'Locked a comment!',
            'requestFailed': 'Failed to lock a comment!',
            'unknownFailure': 'Something went wrong while locking a comment!'
        }),
        'updateElem': async (commentElem, commentData, commentContentContainer, commentActionsContainer) => {
            commentElem.classList.add('cpp-comment-locked');

            const betterDetails = await createBetterActionDetails('cpp-lock-highlight', commentData, commentContentContainer, 'lock');

            commentActionsContainer.appendChild(createActionContainer('Locked', 'cpp-comment-action-lock', 'bi-lock-fill', betterDetails));
        }
    },
    'unlock': async id => await postCommentAction('https://www.reddit.com/api/unlock', {
            'id': id,
            'r': currentSubreddit,
            'uh': modHash,
            'renderstyle': 'html'
        }, {
            'requestSuccessful': 'Unlocked a comment!',
            'requestFailed': 'Failed to unlock a comment!',
            'unknownFailure': 'Something went wrong while unlocking a comment!'
        }),
    'report': {
        'openDialog': async (author, id) => {
            const reportFrameContainer = document.createElement('div');
                reportFrameContainer.classList.add('cpp-report-frame-container');
                reportFrameContainer.onclick = () => reportFrameContainer.remove();

            const iFrame = document.createElement('iframe');
                iFrame.classList.add('cpp-report-frame');
                iFrame.src = 'https://www.reddit.com/framedModal/report?'
                    + `author=${author}`
                    + '&host_app_name=R2'
                    + `&comment_id=${id}`
                    + '&_o=https%3A%2F%2Fwww.reddit.com';
                iFrame.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms';
                iFrame.width = 550;
                iFrame.height = 590;

            reportFrameContainer.appendChild(iFrame);
            document.body.appendChild(reportFrameContainer);
        },
        'updateElem': async (commentElem, commentData, commentContentContainer, commentActionsContainer) => {
            commentElem.classList.add('cpp-comment-reported');

            const details = commentData.reports.map(report => `${report[1]}: ${report[0]}`);

            commentActionsContainer.appendChild(createActionContainer('Reports', 'cpp-comment-action-report', 'bi-flag-fill', details));
        }
    },
    'getBetterActionReason': async (id, mod, actionType) => {
        // action types - https://www.reddit.com/dev/api/#GET_about_log

        const actionLogURL = mod == 'AutoModerator' ? automodLogURL : modActionLogURL(actionType);

        const res = await getCommentData(actionLogURL, 'Failed to load action reason!');

        const children = res?.data?.children;

        if(children) {
            const commentActionData = children.filter(child => child.data['target_fullname'] == id)[0]?.data;

            if(commentActionData) {
                let [ruleViolation, ...violationText] = commentActionData.details.split(' - [');
                violationText = violationText.join(' ').slice(0, -1);

                if(violationText.length <= 1) {
                    violationText = null;
                }

                return {
                    'mod': commentActionData.mod,
                    'action': commentActionData.action,
                    'rule': commentActionData.details,
                    'violatingContent': violationText
                };
            }
        }

        return false;
    },
    'fetch': async (fullname, oldData) => {
        const res = await getCommentData(commentJsonURL(fullname), 'Failed to fetch individual comment data!');

        const children = res?.data?.children;

        if(children) {
            const commentData = children[0]?.data;

            if(commentData && !oldData?.cppGhostComment) {
                // patch data since the api doesn't return link author stuff
                if(oldData && !commentData?.link_author) {
                    commentData.link_author = oldData.link_author;
                    commentData.link_permalink = oldData.link_permalink;
                    commentData.link_title = oldData.link_title;
                    commentData.link_url = oldData.link_url;
                }

                // keep content if comment [deleted]
                if(commentData.author == '[deleted]') {
                    const containerId = `cpp-deleted-container_${weakSanitize(oldData.author_fullname)}`;
                    const bodyToggleBtnClass = 'cpp-deleted-toggle-btn';
                    const hiddenBodyClass = 'cpp-deleted-hidden-body';

                    commentData.cppGhostComment = true;
                    commentData.author = oldData.author;
                    commentData.author_fullname = oldData.author_fullname;
                    commentData.distinguished = oldData.distinguished;

                    commentData.body_html = `<div id="${containerId}"><div class="${bodyToggleBtnClass} md" title="Reveal deleted content (This comment was deleted by the user or Reddit)"><p>[deleted]</p></div></div>`;

                    const waitForGhost = setInterval(() => {
                        const container = document.querySelector(`#${containerId}`);

                        if(container) {
                            clearInterval(waitForGhost);

                            const oldBody = document.createElement('div');
                                oldBody.classList.add(hiddenBodyClass);
                                oldBody.innerHTML = oldData.body_html;

                            container.appendChild(oldBody);

                            const deletedBtn = container.querySelector(`.${bodyToggleBtnClass}`);
                            const hiddenBody = container.querySelector(`.${hiddenBodyClass}`);

                            deletedBtn.onclick = () => {
                                hiddenBody.classList.toggle(hiddenBodyClass);
                            };
                        }
                    }, 500);

                    setTimeout(() => clearInterval(waitForGhost), 1e5);
                }

                return commentData;
            }
        }

        return false;
    },
}

function newCommentNotifications(comment) {
    const isCommentAQuestion = comment.body.includes('?');

    if(commentNotifications && comment.body && comment.author.name) {
        const permission = Notification.permission;

        if(permission === "granted"){
            showNotification();
        } else if(permission === "default"){
            requestAndShowPermission();
        }

        function requestAndShowPermission() {
            Notification.requestPermission(permission =>  {
                if (permission == "granted") {
                    showNotification();
                }
            });
        }

        function showNotification() {
            if(!pageActive) {
                GM_notification(
                    {
                        title: `${comment.author.name} commented`,
                        text: comment.body,
                        onclick: console.log
                    }
                );
            }
        }
    }

    if(commentAudioEffect && comment.body && comment.author.name) {
        const isAnyViolations = (comment.removed || comment.reports || comment.spam);

        if(onlyOnViolatingComments && !isAnyViolations) return;
        if(onlyTabbedOut && pageActive) return;

        if(useVillager) {
            let selectedAudioURL = null;

            if(comment.removed) {
                selectedAudioURL = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/17/Villager_deny1.ogg";
            } else if(isCommentAQuestion) {
                selectedAudioURL = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e7/Villager_trade1.ogg";
            } else {
                selectedAudioURL = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/0e/Villager_idle1.ogg";
            }

            const newCommentsAudio = new Audio(selectedAudioURL);

            newCommentsAudio.play();
        } else {
            const msg = new SpeechSynthesisUtterance(`${comment.author.name} made a new comment! ${isAnyViolations ? 'This comment probably violates some rules, please check it immediately!' : ''}`);

            window.speechSynthesis.speak(msg);
        }
    }
}

function addControlPanel() {
    const topContainerElem = document.createElement('div');
        topContainerElem.id = 'cpp-top-container';
        topContainerElem.innerHTML = `
        <div id="cpp-title"><b>Comments++</b><br>v${GM_info.script.version} <u><a href="https://www.github.com/hakorr/userscripts" target="_blank">GitHub</a></u></div>
        <div class="cpp-vertical-line"></div>
        `;

    const liveIconContainer = document.createElement('div');
        liveIconContainer.classList.add('cpp-infobox');
        liveIconContainer.classList.add('cpp-infobox-btn');
        liveIconContainer.classList.add('cpp-tooltip');
        liveIconContainer.innerHTML = `
        <div class="cpp-infobox-top">
            Live
        </div>
        <div class="cpp-infobox-bottom">
            <div class="cpp-live-icon"></div>
        </div>
        <span class="cpp-tooltip-text">The live feed is active if the red light is blinking. You can click the light to start or stop the live feed.</span>
        `;

    const liveIconElem = liveIconContainer.querySelector('.cpp-live-icon');

    function activateLiveFeed() {
        GM_setValue('liveUpdateActivated', true);
        liveIconElem.classList.add('cpp-live-animation');
        liveIconContainer.classList.add('cpp-live-active');
    }

    function disableLiveFeed() {
        GM_setValue('liveUpdateActivated', false);
        liveIconElem.classList.remove('cpp-live-animation');
        liveIconContainer.classList.remove('cpp-live-active');
    }

    if(!GM_getValue('liveUpdateActivated')) {
        activateLiveFeed();
    }

    liveIconContainer.onclick = () => {
        if(GM_getValue('liveUpdateActivated'))
            disableLiveFeed();
        else
            activateLiveFeed();
    }

    const breakTimeContainer = document.createElement('div');
        breakTimeContainer.classList.add('cpp-infobox');
        breakTimeContainer.classList.add('cpp-tooltip');
        breakTimeContainer.innerHTML = `
        <div class="cpp-infobox-top">
            You can take a break for
        </div>
        <div class="cpp-infobox-bottom">
            ...
        </div>
        <span class="cpp-tooltip-text">You can take a break for this long until ${breakPostThreshold} comments have been posted. You can change your threshold in the userscript's settings.</span>
        `;

    async function updateBreakTime() {
        const breakLength = await getBreakLength(breakPostThreshold);
        breakTimeContainer.querySelector('.cpp-infobox-bottom').innerText = breakLength;
    }

    const commentRateContainer = document.createElement('div');
        commentRateContainer.classList.add('cpp-infobox');
        commentRateContainer.classList.add('cpp-tooltip');
        commentRateContainer.innerHTML = `
        <div class="cpp-infobox-top">
            Comment rate
        </div>
        <div class="cpp-infobox-bottom">
            ...
        </div>
        <span class="cpp-tooltip-text">The subreddit receives one comment every x seconds. This is based on a calculation of the average time between ${breakDatasetSize} latest comments. You can change amount of comments used for the calculation in the userscript's settings.</span>
        `;

    async function updateCommentRate() {
        const commentRate = await getBreakLength(1);
        commentRateContainer.querySelector('.cpp-infobox-bottom').innerText = `every ${commentRate}`;
    }

    const seenCommentsAmountContainer = document.createElement('div');
        seenCommentsAmountContainer.classList.add('cpp-infobox');
        seenCommentsAmountContainer.classList.add('cpp-tooltip');
        seenCommentsAmountContainer.innerHTML = `
        <div class="cpp-infobox-top">
            Comments checked
        </div>
        <div class="cpp-infobox-bottom">
            ...
        </div>
        <span class="cpp-tooltip-text">You can mark a comment as 'checked' simply by clicking/interacting with it. The total times you've done this is shown above.</span>
        `;

    async function updateCommentsAmount() {
        seenCommentsAmountContainer.querySelector('.cpp-infobox-bottom').innerText = (GM_getValue(seenCommentsDatabaseKey)?.length || 0) + ' comments';
    }

    topContainerElem.appendChild(liveIconContainer);
    topContainerElem.appendChild(breakTimeContainer);
    topContainerElem.appendChild(commentRateContainer);
    topContainerElem.appendChild(seenCommentsAmountContainer);

    updateControlPanel = () => {
        if(!waitingForNextPanelUpdate) {
            waitingForNextPanelUpdate = true;

            updateBreakTime();
            updateCommentRate();

            setTimeout(() => waitingForNextPanelUpdate = false, 3e5);
        }

        updateCommentsAmount();
    };

    if(GM_getValue('liveUpdateActivated')) {
        activateLiveFeed();
    }

    document.body.prepend(topContainerElem);
}

function highlightText(typeClass, commentContentContainer, betterActionReasonObj) {
    if(betterActionReasonObj.violatingContent == null) return;

    const sanitizedStr = weakSanitize(betterActionReasonObj.violatingContent);

    commentContentContainer.innerHTML = commentContentContainer.innerHTML.replaceAll(sanitizedStr, `<span class="${typeClass}"></span>`);

    const highlighted = commentContentContainer.querySelector(`.${typeClass}`);

    if(highlighted) {
        highlighted.innerText = betterActionReasonObj.violatingContent;
    }
}

function startCommentHoverLogic(commentElem) {
    let hoveringComment = false;

    commentElem.onmouseover = () => {
        if(!hoveringComment) {
            function markCommentAsSeen() {
                if(hoveringComment && commentElem.classList.contains('cpp-new-comment-unseen')) {
                    commentElem.classList.remove('cpp-new-comment-unseen');
                    commentElem.classList.add('cpp-seen-comment');

                    databaseHelpers.array.addValue(seenCommentsDatabaseKey, commentElem.dataset.fullname);

                    updateControlPanel();
                }
            }

            setTimeout(markCommentAsSeen, msBeforeCommentMarkedAsSeen);
            hoveringComment = true;
        }
    };

    commentElem.onmouseleave = () => hoveringComment = false;
}

async function createCommentElem(commentData) {
    const comment = createCommentDataObj(commentData);

    const isCommentSeen = databaseHelpers.array.doesValueExist(seenCommentsDatabaseKey, comment.fullname);
    const shouldBeCollapsed = databaseHelpers.array.doesValueExist('collapsedComments', comment.fullname);

    const commentElem = document.createElement('div');
        if(commentData?.cppGhostComment) {
            commentElem.classList.add('cpp-ghost-comment');
        } else {
            commentElem.classList.add('cpp-comment');
        }

        commentElem.id = 'thing_' + comment.fullname;
        commentElem.dataset.type = 'comment';
        commentElem.dataset.gildings = comment.gildings;
        commentElem.dataset.fullname = comment.fullname;
        commentElem.dataset.subreddit = comment.subreddit.name;
        commentElem.dataset.subredditFullname = comment.subreddit.id;
        commentElem.dataset.subredditPrefixed = comment.subreddit.prefixed;
        commentElem.dataset.subredditType = comment.subreddit.type;
        commentElem.dataset.author = comment.author.name;
        commentElem.dataset.authorFullname = comment.author.id;
        commentElem.dataset.permalink = comment.permalink;
        commentElem.dataset.parentFullname = comment.parent.fullname;

    ///////////////////////////////////////////////////////////
    // ADD COMMENT INFO (OP, Parent content, timestamp, etc) //
    ///////////////////////////////////////////////////////////

    const commentInfoContainer = document.createElement('div');
    commentInfoContainer.classList.add('cpp-comment-info');

    function toggleCommentCollapse(collapseBtn) {
        databaseHelpers.array.toggleValue('collapsedComments', comment.fullname);

        commentElem.classList.toggle('cpp-comment-collapsed');

        collapseBtn.classList.toggle('bi-fullscreen-exit');
        collapseBtn.classList.toggle('bi-fullscreen');
    }

    function collapseComment(collapseBtn) {
        commentElem.classList.add('cpp-comment-collapsed');

        collapseBtn.classList.add('bi-fullscreen-exit');
        collapseBtn.classList.add('bi-fullscreen');
    }

    const collapseBtn = document.createElement('div');
        collapseBtn.classList.add('cpp-comment-collapse-btn');
        collapseBtn.classList.add('bi-fullscreen-exit');
        collapseBtn.title = 'Collapse comment';
        collapseBtn.onclick = () => toggleCommentCollapse(collapseBtn);

    if(shouldBeCollapsed) {
        collapseComment(collapseBtn);
    }

    const authorLink = document.createElement('a');
        authorLink.classList.add('cpp-comment-author-link');
        authorLink.innerText = comment.author.name;
        authorLink.href = 'https://www.reddit.com/u/' + comment.author.name;
        authorLink.target = '_blank';
        authorLink.title = 'Comment author';

    if(comment.author.distinction) {
        const authorDistinction = document.createElement('div');
            switch(comment.author.distinction) {
                case 'moderator':
                    authorDistinction.classList.add('cpp-comment-distinction-mod');
                    authorDistinction.classList.add('bi-shield-fill');
                    authorDistinction.title = 'Moderator';
                    break;
                case 'admin':
                    authorDistinction.classList.add('cpp-comment-distinction-admin');
                    authorDistinction.classList.add('bi-reddit');
                    authorDistinction.title = 'Reddit Admin';
                    break;
                case 'special':
                    authorDistinction.classList.add('cpp-comment-distinction-special');
                    authorDistinction.classList.add('bi-award-fill');
                    authorDistinction.title = 'Special user (e.g. a former Reddit Admin)';
                    break;
            }

        authorLink.appendChild(authorDistinction);
    }

    const commentedToText = document.createElement('div');
        commentedToText.title = comment.author.name + ' commented to ' + comment.parent.title;
        commentedToText.innerText = '❯';

    const commentParentPostLink = document.createElement('a');
        commentParentPostLink.classList.add('cpp-comment-parent-link');
        commentParentPostLink.href = comment.parent.permalink;
        commentParentPostLink.target = '_blank';
        commentParentPostLink.title = 'Comment parent';
        commentParentPostLink.innerText = comment.parent.title;

    const commentTimestamp = document.createElement('time');
        commentTimestamp.classList.add('cpp-comment-timestamp');
        commentTimestamp.title = new Date(comment.created * 1000).toDateString() + ' ' + new Date(comment.created * 1000).toTimeString();

    function updateTimeStamp() {
        const timeSincePosted = simpleSecondsToReadableForm((Date.now() / 1000) - comment.created);

        commentTimestamp.innerText = `· ${timeSincePosted}`;
    }

    updateTimeStamp();

    const timestampLoop = setInterval(() => {
        if(!commentElem) {
            clearInterval(timestampLoop);
        }

        updateTimeStamp();
    }, timestampUpdateRateMs);


    let cuttedBody = comment.body.replaceAll('\n','').slice(0, 50);

    if(cuttedBody.length != comment.body.length) {
        cuttedBody = cuttedBody + '...';
    }

    const commentCollapsedBody = document.createElement('div');
        commentCollapsedBody.classList.add('cpp-comment-collapsed-body');
        commentCollapsedBody.innerText = cuttedBody;

    commentInfoContainer.appendChild(collapseBtn);
    commentInfoContainer.appendChild(authorLink);
    commentInfoContainer.appendChild(commentedToText);
    commentInfoContainer.appendChild(commentParentPostLink);
    commentInfoContainer.appendChild(commentCollapsedBody);
    commentInfoContainer.appendChild(commentTimestamp);

    commentElem.appendChild(commentInfoContainer);



    ///////////////////////////////////////////////////
    // ADD COMMENT CONTENT (Comment text, gifs, etc) //
    ///////////////////////////////////////////////////

    const commentContentContainer = document.createElement('div');
        commentContentContainer.classList.add('cpp-comment-content');
        commentContentContainer.innerHTML = comment.body_html;

    const commentViewLink = document.createElement('a');
        commentViewLink.classList.add('cpp-comment-view-link');
        commentViewLink.target = '_blank';
        commentViewLink.href = 'https://www.reddit.com' + comment.permalink + '?context=3';
        commentViewLink.innerText = 'View comment';

    commentContentContainer.appendChild(commentViewLink);

    [...commentContentContainer.querySelectorAll('a')].forEach(linkElem => {
        if(!linkElem.href.includes('://preview.redd.it/')) return;

        linkElem.classList.add('cpp-image-link');
        linkElem.target = '_blank';
        linkElem.innerText = '';

        const imageElem = document.createElement('img');
        imageElem.classList.add('cpp-image');
        imageElem.src = linkElem.href;

        linkElem.appendChild(imageElem);
    });

    commentElem.appendChild(commentContentContainer);



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // SET COMMENT STATUS (Approved, reported, removed, locked, etc) (and their possible reasons) //
    ////////////////////////////////////////////////////////////////////////////////////////////////

    const commentActionsContainer = document.createElement('div');
        commentActionsContainer.classList.add('cpp-comment-actions');

    if(comment.approved.by) {
        await commentActions.approve.updateElem(commentElem, comment, commentContentContainer, commentActionsContainer);
    }

    if(comment.removed || comment.banned.by) {
        await commentActions.remove.updateElem(commentElem, comment, commentContentContainer, commentActionsContainer);
    }

    if(comment.locked) {
        await commentActions.lock.updateElem(commentElem, comment, commentContentContainer, commentActionsContainer);
    }

    if(comment.reports?.length > 0) {
        await commentActions.report.updateElem(commentElem, comment, commentContentContainer, commentActionsContainer);
    }

    commentElem.appendChild(commentActionsContainer);



    ////////////////////////////////////////////////
    // ADD COMMENT BUTTONS (Approve, remove, etc) //
    ////////////////////////////////////////////////

    const commentButtonsContainer = document.createElement('div');
    commentButtonsContainer.classList.add('cpp-comment-buttons');

    const approveBtn = document.createElement('div');
        approveBtn.classList.add('cpp-comment-approve-btn');
        approveBtn.classList.add('cpp-comment-btn');
        approveBtn.classList.add('bi-check-lg');
        approveBtn.title = 'Approve comment';
        approveBtn.onclick = async () => {
            await commentActions.approve.sendRequest(comment.fullname);
            updateComment(commentElem, commentData, true);
        }

    const removeBtn = document.createElement('div');
    removeBtn.classList.add('cpp-comment-remove-btn');
    removeBtn.classList.add('cpp-comment-btn');
    removeBtn.classList.add('bi-x');
    removeBtn.title = 'Remove comment';
    removeBtn.onclick = async () => {
        await commentActions.remove.sendRequest(comment.fullname);
        updateComment(commentElem, commentData, true);
    }

    const lockBtnUnlockedClass = 'bi-lock';
    const lockBtnLockedClass = 'bi-unlock';

    const lockBtn = document.createElement('div');
        lockBtn.classList.add('cpp-comment-lock-btn');
        lockBtn.classList.add('cpp-comment-btn');
        lockBtn.title = 'Lock comment';
        lockBtn.onclick = async () => {
            lockBtn.classList.toggle(lockBtnUnlockedClass);
            lockBtn.classList.toggle(lockBtnLockedClass);

            if(!lockBtn.classList.contains(lockBtnUnlockedClass)) {
                await commentActions.lock.sendRequest(comment.fullname);
            } else {
                await commentActions.unlock(comment.fullname);
            }

            updateComment(commentElem, commentData, true);
        }

    if(comment.locked) {
        lockBtn.classList.add(lockBtnLockedClass);
    } else {
        lockBtn.classList.add(lockBtnUnlockedClass);
    }

    const spamBtn = document.createElement('div');
        spamBtn.classList.add('cpp-comment-spam-btn');
        spamBtn.classList.add('cpp-comment-btn');
        spamBtn.classList.add('bi-trash2');
        spamBtn.title = 'Spam comment';
        spamBtn.onclick = async () => {
            await commentActions.spam(comment.fullname);
            updateComment(commentElem, commentData, true);
        }

    const reportBtn = document.createElement('div');
        reportBtn.classList.add('cpp-comment-report-btn');
        reportBtn.classList.add('cpp-comment-btn');
        reportBtn.classList.add('bi-flag');
        reportBtn.title = 'Report comment';
        reportBtn.onclick = async () => {
            await commentActions.report.openDialog(comment.author.name, comment.fullname);
            updateComment(commentElem, commentData, true);
        }

    const translateBtn = document.createElement('div');
        translateBtn.classList.add('cpp-comment-translate-btn');
        translateBtn.classList.add('cpp-comment-btn');
        translateBtn.classList.add('bi-translate');
        translateBtn.title = 'Translate comment';
        translateBtn.onclick = () => {
            window.open(`https://translate.google.com/?sl=auto&tl=en&text=${comment.body}&op=translate`);
        }

    const copyPermalinkBtn = document.createElement('div');
        copyPermalinkBtn.classList.add('cpp-comment-permalink-btn');
        copyPermalinkBtn.classList.add('cpp-comment-btn');
        copyPermalinkBtn.classList.add('bi-share');
        copyPermalinkBtn.title = 'Copy permalink to clipboard';
        copyPermalinkBtn.onclick = () => {
            GM_setClipboard('https://www.reddit.com' + comment.permalink);

            toast.message('Comment link copied to clipboard!', 2e3);
        }

    commentButtonsContainer.appendChild(approveBtn);
    commentButtonsContainer.appendChild(removeBtn);
    commentButtonsContainer.appendChild(spamBtn);
    commentButtonsContainer.appendChild(lockBtn);
    commentButtonsContainer.appendChild(reportBtn);
    commentButtonsContainer.appendChild(translateBtn);
    commentButtonsContainer.appendChild(copyPermalinkBtn);

    if(toolboxActive) {
        const separator = document.createElement('div');
        separator.classList.add('cpp-comment-buttons-separator');

        const tbCommentContextPopupBtn = document.createElement('div');
            tbCommentContextPopupBtn.classList.add('cpp-comment-btn');
            tbCommentContextPopupBtn.classList.add('cpp-comment-tb-context-btn');
            tbCommentContextPopupBtn.classList.add('tb-comment-context-popup');
            tbCommentContextPopupBtn.classList.add('bi-menu-up');
            tbCommentContextPopupBtn.dataset.commentId = comment.fullname;
            tbCommentContextPopupBtn.dataset.contextJsonUrl = comment.permalink + '.json?context=3';
            tbCommentContextPopupBtn.title = 'Open Toolbox context popup';

        const tbUserModActionsBtn = document.createElement('div');
            tbUserModActionsBtn.classList.add('cpp-comment-btn');
            tbUserModActionsBtn.classList.add('cpp-comment-tb-mod-actions-btn');
            tbUserModActionsBtn.classList.add('global-mod-button');
            tbUserModActionsBtn.classList.add('bi-person-gear');
            tbUserModActionsBtn.dataset.subreddit = comment.subreddit.name;
            tbUserModActionsBtn.dataset.author = comment.author.name;
            tbUserModActionsBtn.dataset.parentid = comment.subreddit.id;
            tbUserModActionsBtn.title = 'Perform various mod actions on this user';

        const tbUserHistoryBtn = document.createElement('div');
            tbUserHistoryBtn.classList.add('cpp-comment-btn');
            tbUserHistoryBtn.classList.add('cpp-comment-tb-user-history-btn');
            tbUserHistoryBtn.classList.add('user-history-button');
            tbUserHistoryBtn.classList.add('bi-person-lines-fill');
            tbUserHistoryBtn.dataset.subreddit = comment.subreddit.name;
            tbUserHistoryBtn.dataset.author = comment.author.name;
            tbUserHistoryBtn.title = "View & analyze user's submission and comment history";

        const tbUserNoteBtn = document.createElement('div');
            //tbUserNoteBtn.id = 'add-user-tag';
            tbUserNoteBtn.classList.add('cpp-comment-btn');
            tbUserNoteBtn.classList.add('add-usernote-' + comment.subreddit.name);
            tbUserNoteBtn.classList.add('bi-person-exclamation');
            tbUserNoteBtn.dataset.subreddit = comment.subreddit.name;
            tbUserNoteBtn.dataset.author = comment.author.name;
            tbUserNoteBtn.title = "Manage user notes";
            tbUserNoteBtn.onclick = () => {
                toast.warning('Toolbox user notes are not supported currently, sorry!', 8e3);
            };

        const tbUserProfileBtn = document.createElement('div');
            tbUserProfileBtn.classList.add('cpp-comment-btn');
            tbUserProfileBtn.classList.add('cpp-comment-tb-user-profile-btn');
            tbUserProfileBtn.classList.add('tb-user-profile');
            tbUserProfileBtn.classList.add('bi-person-vcard');
            tbUserProfileBtn.dataset.listing = "overview";
            tbUserProfileBtn.dataset.subreddit = comment.subreddit.name;
            tbUserProfileBtn.dataset.user = comment.author.name;
            tbUserProfileBtn.title = "View user profile";

        commentButtonsContainer.appendChild(separator);
        commentButtonsContainer.appendChild(tbCommentContextPopupBtn);
        commentButtonsContainer.appendChild(tbUserModActionsBtn);
        commentButtonsContainer.appendChild(tbUserHistoryBtn);
        commentButtonsContainer.appendChild(tbUserNoteBtn);
        commentButtonsContainer.appendChild(tbUserProfileBtn);
    }

    commentElem.appendChild(commentButtonsContainer);



    ///////////////////////
    // FINISHING TOUCHES //
    ///////////////////////

    // If the comment is totally new and unseen
    if(!isCommentSeen) {
        console.info(`[Comments++] %cThe snoblins brought you back this comment by ${comment.author.name}:`, 'color: CornflowerBlue;', commentData);

        commentElem.classList.add('cpp-new-comment-unseen');

        startCommentHoverLogic(commentElem);
    }

    async function update() {
        const updated = await updateComment(commentElem, commentData);

        if(updated) {
            // Remove unnecessary listener since this comment elem doesn't exist anymore
            commentElem.removeEventListener('mouseenter', update);
        }
    }

    commentElem.addEventListener('mouseenter', update);

    return commentElem;
}

function clearCommentTableElem() {
    commentTableElem.innerHTML = '';
}

async function addNewCommentToTable(rawCommentDataObj, isReverse, isStartup) {
    const commentData = createCommentDataObj(rawCommentDataObj);

    if(!commentTableElem.querySelector(`.cpp-comment[data-fullname=${commentData.fullname}]`)) {
        const commentElem = await createCommentElem(rawCommentDataObj);

        if(isReverse) {
            commentTableElem.appendChild(commentElem);
        } else {
            commentTableElem.prepend(commentElem);
        }

        addLastSeenCommentMarker();
        updateControlPanel();

        if(!isStartup) {
            newCommentNotifications(commentData);
        }
    }
}

async function updateComment(commentElem, oldRawCommentDataObj, noEffect) {
    const newRawDataObj = await commentActions.fetch(commentElem.dataset.fullname, oldRawCommentDataObj);

    if(newRawDataObj) {
        const newCommentDataObj = createCommentDataObj(newRawDataObj);
        const oldCommentDataObj = createCommentDataObj(oldRawCommentDataObj);

        if(JSON.stringify(newCommentDataObj) != JSON.stringify(oldCommentDataObj)) {
            const newCommentElem = await createCommentElem(newRawDataObj);

            console.log(newCommentDataObj, oldCommentDataObj);
            console.log(newCommentElem, commentElem);

            if(!noEffect) {
                newCommentElem.classList.add('cpp-updated-comment');
            }

            commentTableElem.replaceChild(newCommentElem, commentElem);

            return true;
        }
    }

    return false;
}

async function loadExistingComments() {
    const commentsJSON = await fetch(commentsJsonURL(startCommentAmount), {cache: 'no-store'})
        .then(res => res.json())
        .catch(err => toast.error('Failed to load existing comments!', 1e6));

    if(!commentsJSON) return;

    commentsJSON.data.children.reverse();

    const children = commentsJSON.data.children;

    for(const comment in children) {
        await addNewCommentToTable(children[comment].data, false, true);
    }
}

async function loadNewComments() {
    GM_setValue('isLoadingNewComments', true);

    async function loadOneCommentBefore() {
        try {
            const newestCommentFullname = [...commentTableElem.querySelectorAll('.cpp-comment')][0]?.dataset?.fullname;

            const commentsJSON = await fetch(commentsBeforeJsonURL(newestCommentFullname, 1), {cache: 'no-store'})
                .then(res => res.json())
                .catch(err => toast.error('Failed to update comments!', updateRateMs / 2));

            if(!commentsJSON) {
                GM_setValue('isLoadingNewComments', false);
                return;
            }

            const commentData = commentsJSON.data.children[0]?.data;

            if(commentData) {
                const isNewComment = !databaseHelpers.array.doesValueExist('pastComments', commentData.name);

                if(isNewComment) {
                    await addNewCommentToTable(commentData);
                    databaseHelpers.array.addValue('pastComments', commentData.name);
                    loadOneCommentBefore();
                } else {
                    GM_setValue('isLoadingNewComments', false);
                }
            } else {
                GM_setValue('isLoadingNewComments', false);
            }
        } catch(err) {
            toast.error('Something went wrong while trying to load new comments!', updateRateMs / 2);
            GM_setValue('isLoadingNewComments', false);
        }
    }

    loadOneCommentBefore();
}

async function loadOlderComments() {
    const oldestCommentFullname = [...commentTableElem.querySelectorAll('.cpp-comment')].pop()?.dataset?.fullname;

    if(oldestCommentFullname) {
        const commentsJSON = await fetch(commentsAfterJsonURL(oldestCommentFullname, loadMoreCommentsAmount), {cache: 'no-store'})
            .then(res => res.json())
            .catch(err => toast.error('Failed to load existing comments!', 1e6));

        if(!commentsJSON) return;

        const children = commentsJSON.data.children;

        for(const comment in children) {
            await addNewCommentToTable(children[comment].data, true);
        }
    } else {
        toast.error(`Failed to get the oldest comment's fullname!`, 3e3);
    }
}

function addLoadNewCommentsBtn() {
    const loadOldCommentsContainer = document.createElement('div');
        loadOldCommentsContainer.classList.add('cpp-load-old-comments-container');

    const loadOldCommentsBtn = document.createElement('div');
        loadOldCommentsBtn.classList.add('cpp-load-older-comments-btn');
        loadOldCommentsBtn.classList.add('cpp-infobox-btn');
        loadOldCommentsBtn.onclick = () => {
            loadOlderComments()
        };

        loadOldCommentsBtn.innerText = 'Load more comments';

    loadOldCommentsContainer.appendChild(loadOldCommentsBtn);
    contentElem.appendChild(loadOldCommentsContainer);
}

function saveLastSeenComment() {
    const firstEntry = getCommentElems(document)[0];

    if(firstEntry) {
        GM_setValue('lastSeenCommentID', firstEntry.dataset.fullname);
    }
}

function addLastSeenCommentMarker() {
    const lastSeenCommentID = GM_getValue('lastSeenCommentID');
    const lastLastSpotElem = document.querySelector('#cpp-last-spot');

    if(lastSeenCommentID) {
        const lastSeenCommentElem = document.querySelector(`[data-fullname=${lastSeenCommentID}]`);

        if(!lastSeenCommentElem) return;

        const lastSpotElem = document.createElement('div');
        lastSpotElem.id = 'cpp-last-spot';

        lastSpotElem.innerHTML = `Your last visit got you this far...<div class="cpp-last-spot-line"></div>`;

        if(lastLastSpotElem) lastLastSpotElem.remove();

        commentTableElem.insertBefore(lastSpotElem, lastSeenCommentElem);
    }
}

function removeRedditUI() {
    if(hideRedditHeader) {
        const element = document.querySelector('#header');

        if(element) {
            element.classList.add('cpp-hidden');
        }
    }

    if(hideRedditSidebar) {
        const element = document.querySelector('.side');

        if(element) {
            element.classList.add('cpp-hidden');
        }
    }
}

// This method takes about 6.5mb of network traffic per hour (if constantly updating), so it's really efficient.
async function isFeedUpToDate() {
    const commentsJSON = await fetch(commentsJsonURL(1), {cache: 'no-store'})
        .then(res => res.json())
        .catch(err => toast.error('Failed to check for new comments!', updateRateMs / 2));

    if(commentsJSON) {
        const jsonFirstEntry = commentsJSON.data.children[0].data;
        const newestCommentFullname = [...commentTableElem.querySelectorAll('.cpp-comment')][0]?.dataset?.fullname;

        return newestCommentFullname == jsonFirstEntry.name;
    }
}

async function initialize() {
    GM_setValue('isLoadingNewComments', false);

    clearCommentTableElem();
    loadExistingComments();
    addControlPanel();
    addLoadNewCommentsBtn();

    window.onblur = saveLastSeenComment;

    addLastSeenCommentMarker();
    updateControlPanel();
    removeRedditUI();

    const feedLoop = setInterval(async () => {
      if(GM_getValue('liveUpdateActivated')) {
          const isUpToDate = await isFeedUpToDate();

          if(!isUpToDate) {
              const isUpdating = GM_getValue('isLoadingNewComments');

              if(!isUpdating) {
                  console.info("[Comments++] %cNew comments found! Please wait, we'll send snoblins to gather them for you!", 'color: lightgreen');

                  await loadNewComments();
              }
          } else {
              console.log("[Comments++] %cGood news, we're up-to-date! :)", 'color: orange');
          }
      }
    }, updateRateMs);
}

////////////////////////////////////////////////////////////////
///////// BELOW LIES NO MORE THAN CSS AND INITIALIZE() /////////

GM_addStyle(`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css");
body {
    margin-top: 60px;
}
.comment {
    border-bottom: 1px solid rgb(0 0 0 / 10%);
}
#cpp-top-container {
    width: 100%;
    height: fit-content;
    background-color: rgb(233 233 233);
    display: flex;
    padding: 5px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
    align-content: center;
    align-items: center;
    position: fixed;
    z-index: 999;
    top: 0;
    box-shadow: rgb(128 128 128 / 40%) 0vh 30px 30px -10px;
    font-family: Inter;
}
#cpp-title {
    font-size: 12px;
    margin-right: 5px;
    color: #4c4c4c;
    margin-left: 10px;
}
.cpp-infobox {
    width: fit-content;
    height: 80%;
    display: flex;
    background-color: #dbdbdb;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    border-radius: 5px;
    margin-left: 5px;
    transition: transform .1s;
    padding-left: 10px;
    padding-right: 10px;
    border: 1.5px solid rgb(0 0 0 / 10%);
}
.cpp-live-animation {
    animation-name: cpp-live-animation-keyframes;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate-reverse;
    animation-timing-function: ease;
}
.cpp-new-comment-unseen {
    background-color: rgb(0 0 255 / 25%);
}
.cpp-seen-comment {
    animation-name: cpp-seen-comment-keyframes;
    animation-duration: 2s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-timing-function: ease-out;
}
@keyframes cpp-live-animation-keyframes {
    from {
        background-color: red;
    }
    to {
        background-color: maroon;
    }
}
@keyframes cpp-seen-comment-keyframes {
    0% {
        background-color: rgb(0 0 255 / 25%);
    }
    100% {
        background-color: rgb(0 0 255 / 0%);
    }
}
.cpp-live-icon {
    border-radius: 100%;
    width: 10px;
    height: 10px;
    margin-bottom: 3px;
    background-color: maroon;
}
.cpp-infobox-btn {
    cursor: pointer;
}
.cpp-infobox-btn:hover {
    transform: scale(1.1);
}
.cpp-infobox-btn:active {
    transform: scale(0.9);
}
.cpp-infobox-top {
    font-size: 11px;
    color: #717171;
}
.cpp-infobox-bottom {
    margin-top: 5px;
    font-size: 12px;
    font-weight: 500;
}
.cpp-vertical-line {
    border-left: 1px solid rgb(0 0 0 / 15%);
    height: 25px;
    margin: 5px;
}
.cpp-live-active {
    border: 1.5px solid rgb(255 0 0 / 35%) !important;
}
#cpp-black-hole {
    position: absolute;
    visibility: hidden;
    margin-top: -100vh;
    margin-left: -100vh;
}
#cpp-last-spot {
    box-shadow: rgb(128 128 128 / 40%) 0px 15px 15px -2px;
    font-size: 13px;
    font-weight: 300;
    color: rgb(0 0 0 / 75%);
    margin-top: 25px;
    font-family: Inter;
}
.cpp-tooltip {
    position: relative;
}
.cpp-tooltip .cpp-tooltip-text {
    visibility: hidden;
    width: 160px;
    background-color: orangered;
    color: #ffffff;
    text-align: center;
    border-radius: 4px 4px 6px 6px;
    position: absolute;
    z-index: 999;
    top: 105%;
    left: 50%;
    margin-left: -90px;
    border-bottom: 5px solid rgb(0 0 0 / 50%);
    font-family: Inter;
    font-weight: 500;
    font-size: 13px;
    padding: 10px;
}
.cpp-tooltip:hover .cpp-tooltip-text {
    visibility: visible;
}
.cpp-hidden {
    display: none !important;
}
.cpp-comment {
    display: grid;
    gap: 5px 0px;
    grid-auto-flow: row;
    grid-template-areas:
        "cpp-comment-info"
        "cpp-comment-content"
        "cpp-comment-actions"
        "cpp-comment-buttons";
    font-family: 'Inter';
    padding: 10px 0 10px 15px;
    border-bottom: 1px solid rgb(0 0 0 / 10%);
}
.cpp-ghost-comment {
    display: grid;
    gap: 5px 0px;
    grid-auto-flow: row;
    grid-template-areas:
        "cpp-comment-info"
        "cpp-comment-content"
        "cpp-comment-actions"
        "cpp-comment-buttons";
    font-family: 'Inter';
    padding: 10px 0 10px 15px;
    border-bottom: 1px solid rgb(0 0 0 / 10%);
    border: 2.5px solid rgb(255 0 0 / 50%) !important;
}
.cpp-comment-info {
    grid-area: cpp-comment-info;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
}
.cpp-comment-info * {
    margin-right: 5px;
}
.cpp-comment-content {
    grid-area: cpp-comment-content;
    font-size: 14px;
    display: flex;
    flex-direction: column;
}
.cpp-comment-buttons {
    grid-area: cpp-comment-buttons;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 5px;
    opacity: 0.25;
    width: fit-content;
    transition: all .25s linear;
}
.cpp-comment-buttons:hover {
    opacity: 1;
    display: flex;
}
.cpp-comment-buttons * {
    margin-right: 5px;
}
.cpp-comment-btn {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    font-size: 15px;
    align-items: center;
    display: flex;
    justify-content: center;
    border: 1.5px solid #787878;
    color: #787878;
    cursor: pointer;
}
.cpp-comment-btn:hover {
    color: #ffffff;
    transform: scale(1.1);
    background-color: #585858;
}
.cpp-comment-btn:active {
    transform: scale(0.95);
}
.cpp-comment-approve-btn:hover {
    background-color: #4FAB38;
    border: 1.5px solid #026600;
}
.cpp-comment-approved .cpp-comment-approve-btn {
    background-color: #4FAB38;
    border: 1.5px solid #026600;
    color: #ffffff;
}
.cpp-comment-remove-btn:hover {
    background-color: #8d0000;
    border: 1.5px solid #b00000;
}
.cpp-comment-removed .cpp-comment-remove-btn {
    background-color: #8d0000;
    border: 1.5px solid #b00000;
    color: #ffffff;
}
.cpp-comment-lock-btn {
    font-size: 13px;
}
.cpp-comment-lock-btn:hover {
    background-color: #D39800;
    border: 1.5px solid #B07F00;
}
.cpp-comment-locked .cpp-comment-lock-btn {
    background-color: #D39800;
    border: 1.5px solid #B07F00;
    color: #ffffff;
}
.cpp-comment-spam-btn:hover {
    background-color: #AB3838;
    border: 1.5px solid #660000;
}
.cpp-comment-spammed .cpp-comment-spam-btn {
    background-color: #AB3838;
    border: 1.5px solid #660000;
    color: #ffffff;
}
.cpp-comment-report-btn:hover {
    background-color: #753aea;
    border: 1.5px solid #9058ff;
}
.cpp-comment-translate-btn:hover {
    background-color: #db3f06;
    border: 1.5px solid orangered;
}
.cpp-comment-permalink-btn:hover {
    background-color: #016666;
    border: 1.5px solid #007878;
}
.cpp-comment-score {
    font-size: 15px;
}
.cpp-comment-upvote-btn {
    width: 15px;
    height: 15px;
    font-size: 15px;
    color: rgb(0 0 0 / 20%);
    cursor: pointer;
}
.cpp-comment-upvote-btn:hover {
    color: rgb(0 0 0 / 50%);
}
.cpp-comment-upvote-btn-active {
    color: #ff4500 !important;
}
.cpp-comment-downvote-btn {
    width: 15px;
    height: 15px;
    font-size: 15px;
    color: rgb(0 0 0 / 20%);
    cursor: pointer;
}
.cpp-comment-downvote-btn:hover {
    color: rgb(0 0 0 / 50%);
}
.cpp-comment-downvote-btn-active {
    color: #7193ff !important;
}
.cpp-comment-timestamp {
    font-weight: 300;
}
.cpp-comment-collapse-btn {
    width: 15px;
    height: 15px;
    cursor: pointer;
    color: grey;
}
.cpp-comment-collapse-btn:hover {
    color: #000000;
}
.cpp-comment-view-link {
    font-size: 11px;
    font-weight: 200;
    margin-top: 5px;
    width: fit-content;
}
.cpp-comment-view-link:hover, .cpp-comment-parent-link:hover, .cpp-comment-author-link:hover {
    text-decoration: underline;
}
.cpp-comment-actions > * {
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    height: fit-content;
    border-radius: 5px;
    color: #ffffff;
}
.cpp-comment-action-removal {
    background-color: #9f1409;
}
.cpp-comment-action-lock {
    background-color: #c9911b;
}
.cpp-comment-action-report {
    background-color: #c9911b;
}
.cpp-comment-action-icon {
    font-size: 30px;
    font-size: 20px;
    margin: 8px 5px;
}
.cpp-comment-action-details {
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;
}
.cpp-comment-action-details-title {
    font-size: 14px;
    font-weight: 600;
    margin-top: 7.5px;
}
.cpp-comment-action-detail {
    margin-bottom: 5px;
}
.cpp-comment-approved {
    border-left: 5px solid #00a905 !important;
}
.cpp-comment-approved .md {
    color: #004c02 !important;
}
.cpp-comment-reported {
    border-left: 5px solid #a68a00 !important;
}
.cpp-comment-reported .md {
    color: #b79900 !important;
}
.cpp-comment-removed {
    border-left: 5px solid #870000 !important;
}
.cpp-comment-removed .md {
    color: #770c04 !important;
}
.cpp-comment-spammed {
    border-left: 5px solid #870000 !important;
}
.cpp-comment-spammed .md {
    color: #770c04 !important;
}
.cpp-comment-locked {
    border-top: 3px solid #c9911b;
    border-bottom: 3px solid #c9911b !important;
    background-color: #ffae0317;
}
.cpp-comment-collapsed-body {
    color: grey;
    -webkit-background-clip: text;
    padding-left: 5px;
    display: none;
}
.cpp-comment-buttons-separator {
    height: 15px;
    border-left: 1px solid rgb(0 0 0 / 20%);
}
.cpp-image {
    padding: 1px;
    border: 1px dashed rgb(0 0 0 / 50%);
}
.md img {
    max-width: 15% !important;
    height: auto !important;
}
.cpp-comment-author-link {
    display: flex;
    flex-direction: row;
}
.cpp-comment-distinction-mod {
    margin-left: 2.5px;
    color: #75d377;
}
.cpp-comment-author-link:has(> div.cpp-comment-distinction-mod) {
    color: #007600;
}
.cpp-comment-distinction-admin {
    margin-left: 2.5px;
    color: #ea0027;
}
.cpp-comment-author-link:has(> div.cpp-comment-distinction-admin) {
    color: #ea0027;
}
.cpp-comment-distinction-special {
    margin-left: 2.5px;
    color: #810eff;
}
.cpp-comment-author-link:has(> div.cpp-comment-distinction-special) {
    color: #810eff;
}
.cpp-remove-highlight {
    background-color: #9f1409;
    color: white;
}
.cpp-report-highlight {
    background-color: #c9911b;
    color: white;
}
.cpp-lock-highlight {
    background-color: #c9911b;
    color: white;
}
`);

// comment collapsed
GM_addStyle(`
.cpp-comment-collapsed {
    height: 20px;
}
.cpp-comment-collapsed .cpp-comment-content {
    display: none !important;
}
.cpp-comment-collapsed .cpp-comment-buttons {
    display: none !important;
}
.cpp-comment-collapsed .cpp-comment-collapsed-body {
    display: revert !important;
}
.cpp-comment-collapsed .cpp-comment-parent-link {
    display: none !important;
}
.cpp-comment-collapsed .cpp-comment-actions {
    display: none !important;
}
`);

// toast message
GM_addStyle(`
#cpp-toast-container {
    display: flex;
    width: 100%;
    height: fit-content;
    position: fixed;
    bottom: 50px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.cpp-toast {
    min-width: 250px;
    max-width: 50%;
    background-color: #1A1A1B;
    color: #fff;
    border-radius: 4px;
    border: 1px solid #818384;
    z-index: 99999999;
    width: fit-content;
    font-family: Inter;
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}
.cpp-toast-close-btn {
    width: 7px;
    background-color: grey;
    margin-right: 10px;
    transition: all 0.25s;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
}
.cpp-toast-close-btn-icon {
    opacity: 0;
    font-size: 25px;
    color: #ffffff;
    transition: all 0.25s;
}
.cpp-toast-icon {
    font-size: 20px;
    margin-bottom: 3px;
    margin-left: 13px;
    padding-top: 3px;
}
.cpp-toast-content {
    padding: 13px;
    text-align: center;
    font-size: 13px;
}
.cpp-toast:hover .cpp-toast-close-btn-icon {
    opacity: 1;
}
.cpp-toast:hover .cpp-toast-close-btn {
    width: 40px;
}
.cpp-toast-success {
    background-color: #01d000;
}
.cpp-toast-message {
    background-color: #24A0ED;
}
.cpp-toast-warning {
    background-color: #ff9100;
}
.cpp-toast-error {
    background-color: #ff0000;
}
@-webkit-keyframes fadein {
    from {
        margin-bottom: -50px;
        opacity: 0;
    }
    to {
        margin-bottom: 5px;
        opacity: 1;
    }
}
@keyframes fadein {
    from {
        margin-bottom: -50px;
        opacity: 0;
    }
    to {
        margin-bottom: 5px;
        opacity: 1;
    }
}
@-webkit-keyframes fadeout {
    from {
        margin-bottom: 5px;
        opacity: 1;
    }
    to {
        margin-bottom: -50px;
        opacity: 0;
    }
}
@keyframes fadeout {
    from {
        margin-bottom: 5px;
        opacity: 1;
    }
    to {
        margin-bottom: -50px;
        opacity: 0;
    }
}
.cpp-last-spot-line {
    border-top: 2px dashed rgb(0 0 0 / 50%);
    margin: 5px;
}
`);

// report iFrame dialog
GM_addStyle(`
.cpp-report-frame-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgb(0 0 0 / 50%);
    z-index: 999999999;
    display: flex;
    justify-content: center;
    align-items: center;
}
.cpp-report-frame {
    border: 0;
}
`);

// updated comment effect
GM_addStyle(`
.cpp-updated-comment {
    animation-name: cpp-updated-comment-keyframes;
    animation-duration: 2s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-timing-function: ease-out;
}
@keyframes cpp-updated-comment-keyframes {
    0% {
        background-color: rgb(255 255 0 / 25%);
    }
    100% {
        background-color: rgb(255 255 0 / 0%);
    }
}
`);

// load old comments btn
GM_addStyle(`
.cpp-load-old-comments-container {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    margin-top: 30px;
}
.cpp-load-older-comments-btn {
    width: fit-content;
    height: fit-content;
    padding: 5px;
    border-radius: 5px;
    color: #717171;
    background-color: #dbdbdb;
    border: 2px solid rgb(0 0 0 / 10%);
}
`);

GM_addStyle(`
.cpp-deleted-toggle-btn {
    background-color: rgb(255 0 0 / 50%);
    width: fit-content;
    padding: 2px;
    border-radius: 3px;
    cursor: pointer;
}
.cpp-deleted-hidden-body {
    display: none;
}
`);

// darkmode
if(uiDarkmodeActivated) GM_addStyle(`
body {
    background-color: #1c1c1c;
}
#cpp-top-container {
    background-color: #262626;
    box-shadow: rgb(0 0 0 / 25%) 0vh 30px 30px -10px;
}
#cpp-title {
    color: #c4c4c4;
}
.cpp-infobox {
    background-color: #3f3f3f;
    border-color: rgb(255 255 255 / 10%);
}
.cpp-infobox-top {
    color: #9b9b9b;
}
.cpp-infobox-bottom {
    color: #cecece;
}
.cpp-live-active {
    border-color: rgb(255 0 0 / 50%) !important;
}
#siteTable {
    background-color: #1E1E1E;
}
#cpp-last-spot {
    box-shadow: rgb(0 0 0 / 25%) 0px 15px 15px -2px;
    color: rgb(216 216 216 / 75%);
}
.cpp-last-spot-line {
    border-top-color: rgb(255 255 255 / 50%);
}
.cpp-comment {
    border-bottom-color: rgb(255 255 255 / 10%);
    color: #a7a7a7;
}
.cpp-ghost-comment {
    border-bottom-color: rgb(255 255 255 / 10%);
    color: #a7a7a7;
}
.cpp-comment-content .md * {
    color: gainsboro !important;
}
.cpp-load-older-comments-btn {
    color: #cecece;
    background-color: #3f3f3f;
    border-color: rgb(255 255 255 / 10%);
}
.cpp-comment .md a {
    color: #3a87d3 !important;
}
.cpp-comment-info a {
    color: #45709b !important;
}
.cpp-comment-view-link {
    color: #777777;
}
.cpp-new-comment-unseen {
    background-color: rgb(144 144 255 / 25%);
}
@keyframes cpp-seen-comment-keyframes {
    0% {
        background-color: rgb(144 144 255 / 25%);
    }
    100% {
        background-color: rgb(144 144 255 / 0%);
    }
}
.cpp-comment-collapsed-body {
    color: #c5c5c5;
}
.cpp-comment-collapse-btn:hover {
    color: #e4e4e4;
}
`);

initialize();
