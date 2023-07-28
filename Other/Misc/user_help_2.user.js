// ==UserScript==
// @name        SearchSort
// @namespace   HKR
// @match       *://www.youtube.com/*/search*
// @grant       none
// @version     1.0
// @author      HKR
// @description Sorts videos by date on channel search (Quickly made for https://www.reddit.com/r/userscripts/comments/15bnkt0/userscript_request_sort_videos_from_channel/)
// @run-at      document-start
// ==/UserScript==

const dateWords = ['hour', 'day', 'week', 'month', 'year'];
const itemScoreObjArr = [];

function getListItemScore(listItemElem) {
    /*
    const existingScoreObj = itemScoreObjArr.find(scoreObj => scoreObj.itemElem === listItemElem);

    if(existingScoreObj) {
        return existingScoreObj.score;
    }*/

    const dateSpan = listItemElem.querySelectorAll('.inline-metadata-item.ytd-video-meta-block')?.[1];

    let score = Infinity;

    if(dateSpan?.innerText) {
        const dateTextSplit = dateSpan.innerText.split(' '),
              dateNum = dateTextSplit[0],
              dateWord = dateTextSplit[1];

        const dateNumScore = Number(dateNum);
        const dateWordScore = dateWords.indexOf(dateWords.find(x => dateWord.includes(x))) * 100;

        score = dateNumScore + dateWordScore;

        //console.log(listItemElem, dateTextSplit, dateNum, dateWord, dateNumScore, dateWordScore, score);
    }

    //itemScoreObjArr.push({ 'itemElem': listItemElem, 'score': score });
    //console.log(itemScoreObjArr);

    return score;
}

function sort() {
    const listContainer = document.querySelector('#contents.ytd-section-list-renderer');

    if(!listContainer) {
        console.error('No listContainer!');

        return;
    }

    console.warn('Sorting!');

    const listItemElems = [...listContainer.childNodes];

    listItemElems.sort((a, b) => {
        const scoreA = getListItemScore(a);
        const scoreB = getListItemScore(b);

        return scoreA - scoreB;
    });

    listItemElems.forEach(elem => listContainer.appendChild(elem));
}

setInterval(sort, 1000);
