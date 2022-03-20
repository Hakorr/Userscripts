// ==UserScript==
// @name        IltaPlus
// @namespace   HKR
// @match       https://www.iltalehti.fi/*
// @grant       none
// @version     2.1
// @author      HKR
// @description Iltalehden "Plus-Tilaus" ilmaiseksi
// @run-at      document-load
// @grant       GM_addStyle
// ==/UserScript==

class ElementGenerator {
    handleType(type, sectionData) {
        switch(type) {
            case "paragraph":
                return this.paragraph(sectionData.items);
            case "subheadline":
                return this.subheadline(sectionData.text);
            case "list":
                return this.list(sectionData.items);
            case "aside":
                return this.aside(sectionData.items);
            case "related-article":
                return this.relatedArticle(sectionData.article);
            case "image":
                return this.image(sectionData);
            case "embed":
                return this.embed.unknown(sectionData);
            case "divider":
                return this.divider();
        }
    }

    content(contentArr) {
        let generatedHTML = "";

        contentArr.forEach(item => {
            const type = item.type;
            
            switch(type) {
                case "text":
                    generatedHTML += `${item.text}`;
                    break;

                case "bold":
                    let boldText = "";
    
                    item.items.forEach(boldItem => {
                        boldText += boldItem.text;
                    });
    
                    generatedHTML += `<strong>${boldText}</strong>`;
                    break;

                case "link":
                    let generatedContent = this.content(item.items);

                    generatedHTML += `<a href="${item.url}">${generatedContent}</a>`;
                    break;
                
                case "italic":
                    let italicText = "";

                    item.items.forEach(item => {
                        italicText += item.text;
                    });

                    generatedHTML += `<i>${italicText}</i>`;
                    break;
                
                default:
                    let text= "";

                    item.items.forEach(item => {
                        text += item.text;
                    });

                    generatedHTML += text;
                    break;
            }
        });
    
        return generatedHTML;
    }

    paragraph(contentArr) {
        let paragraph = document.createElement('p');
        paragraph.className = "paragraph";
    
        let generatedHTML = this.content(contentArr);
    
        paragraph.innerHTML = generatedHTML;
    
        return paragraph;
    }

    subheadline(textContent) {
        const subheadline = document.createElement('h3');
        subheadline.className = "subheadline";
        subheadline.innerText = textContent;
    
        return subheadline;
    }

    image(imageData) {
        const image = document.createElement('div');
        image.className = `article-image gallery ${imageData.properties.float}`;
        image.setAttribute("itemprop", "image");
        image.setAttribute("itemscope", "");
        image.setAttribute("itemtype", "http://schema.org/ImageObject");
        image.setAttribute("role", "button");
        image.setAttribute("tabindex", "0");
        image.innerHTML = `
        <div class="article-image-container" style="padding-bottom:${(imageData.properties.height / imageData.properties.width) * 100}%">
            <img class="image image-show image-preview" src="${imageData.urls.size30}" alt="${imageData.properties.caption}">
            <img class="image image-show" src="${imageData.urls.size612}" srcset="${imageData.urls.size310} 310w, ${imageData.urls.size510} 510w, ${imageData.urls.size612} 612w" alt="${imageData.properties.caption}">
        </div>
        <meta itemprop="url" content="${imageData.urls.size612}">
        <meta itemprop="width" content="${imageData.properties.width}">
        <meta itemprop="height" content="${imageData.properties.height}">
        <div class="media-caption">
            <meta itemprop="description" content="${imageData.properties.caption}"/>
            <span class="caption-text" itemprop="description">${imageData.properties.caption}</span>
            <span class="media-source">${imageData.properties.source}</span>
        </div>
        `;
    
        return image;
    }

    list(items) {
        const listElem = document.createElement('div');
        listElem.className = "article-bullets";
    
        const list = document.createElement('ul');
    
        items.forEach(item => {
            let generatedHTML = this.content(item);
    
            list.innerHTML += `<li>${generatedHTML}</li>`;
        });
    
        listElem.appendChild(list);
    
        return listElem;
    }

    aside(items) {
        const asideContainer = document.createElement('div');
        asideContainer.className = "aside-container";
    
        const aside = document.createElement('div');
        aside.className = "aside";
    
        items.forEach(item => {
            const type = item.type;
    
            const sectionElement = this.handleType(type, item);
    
            if(typeof sectionElement == "object") {
                aside.appendChild(sectionElement);
            }
        });
    
        asideContainer.appendChild(aside);

        return asideContainer;
    }

    relatedArticle(article) {
        const relatedArticle = document.createElement('div');
        relatedArticle.className = "related-articles related-articles-within-text";
    
        relatedArticle.innerHTML += `<h3>Lue myös</h3>`;
        relatedArticle.innerHTML += `<a href="/${article.category.category_name}/a/${article.article_id}">${article.headline}</a>`;
    
        return relatedArticle;
    }

    divider() {
        const divider = document.createElement('div');
        divider.className = "article-divider";
        divider.innerHTML = `<div class="article-divider-content"></div>`;
    
        return divider;
    }

    embed = {
        twitter: twitterData => {
            const twitterEmbed = document.createElement('div');
            twitterEmbed.className = "twitter-container article-embed";
            twitterEmbed.innerHTML = twitterData.embed_html;
        
            return twitterEmbed;
        },
        default: embedData => {
            const embed = document.createElement('div');
            embed.innerHTML = embedData.embed_html;
        
            return embed.firstChild;
        },
        unknown: embedData => {
            switch(embedData.name) {
                case "twitter": return this.embed.twitter(embedData);
                default: return this.embed.default(embedData);
            }
        }
    }
};

const bypassPaywall = async () => {
    const page = digitalData.page.attributes;
    const pageID = page.content.cid;
    const paidArticle = page.contentCharge == "paid" ? true : false;

    if(!paidArticle) return; // article is free, do not proceed

    const articleBodyElement = document.createElement('div');
    articleBodyElement.id = "bypassed-article-body";
    articleBodyElement.innerHTML = `
    <div style="margin-bottom: 10px;">
        <a class="subheadline" href="https://github.com/Hakorr/Userscripts/tree/main/Iltalehti.fi/IltaPlus">
            Bypassed by <strong>IltaPlus</strong>
        </a>
    </div>
    `;
    
    const articleData = await fetch(`https://api.il.fi/v1/articles/${pageID}?include_main_media=true`)
        .then(response => response.json())
        .then(json => json.response);

    console.log("Article data: ", articleData);

    const articleBody = articleData.body;

    const ElemGen = new ElementGenerator();

    articleBody.forEach(sectionData => {
        const type = sectionData.type;

        const sectionElement = ElemGen.handleType(type, sectionData);

        if(typeof sectionElement == "object") {
            articleBodyElement.appendChild(sectionElement);
        }
    });

    GM_addStyle(`
    .subheadline {
         font-size: 18px; margin: 0 14px 15px; 
    }
    .aside-container {
        clear: both;
        font-size: 16px;
        margin: 0 14px 14px;
        border: 1px solid #ddd;
        background-color: #f7f7f7;
    }
    .aside-container h3:first-of-type {
        color: #dc0000;
        margin: 14px;
    }
    .aside-container h3 {
        color: #222;
        font-family: Bernino Sans Condensed,Arial,Verdana;
        font-size: 16px;
        font-weight: 700;
        margin: 10px 14px;
    }
    .paragraph {
        color: #222;
        margin: 0 14px 15px;
        line-height: 1.45;
    }
    `);
            
    console.log("Processed (n' bypassed) article:", articleBodyElement);

    document.querySelector(".article-body").innerHTML = articleBodyElement.innerHTML;
    document.querySelector("#anop-container")?.remove();
};

let lastID = "";

setInterval(() => {
    let currentID = digitalData.page.attributes?.content.cid;

    if(lastID != currentID)
    {
        lastID = currentID;
        bypassPaywall();
    }
}, 500);
