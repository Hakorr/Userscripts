// ==UserScript==
// @name         [Pixlr] Premium Content Remover
// @version      1.0.8
// @description  Removes premium features on Pixlr.com, because they are just on your way.
// @author       HKR
// @match        https://pixlr.com/x/*
// @grant        none
// @namespace    HKR
// ==/UserScript==
 
(function() { try{
var refresh_rate = 1; //Milliseconds (1000 = 1 second)
 
async function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}
 
async function noPremiumFeatures() {
    if (window.location.href.indexOf("editor") > -1) {
        if(document.getElementById("tool-glitch")) document.getElementById("tool-glitch").outerHTML = "";
        if(document.getElementById("tool-focus")) document.getElementById("tool-focus").outerHTML = "";
        if(document.getElementById("tool-focus")) document.getElementById("tool-focus").outerHTML = "";
        if(document.getElementById("tool-dispersion")) document.getElementById("tool-dispersion").outerHTML = "";
        if(document.getElementById("cutout-auto")) document.getElementById("cutout-auto").outerHTML = '<a class="" id="cutout-auto"></a>';
 
		    addGlobalStyle('#sneaky { visibility: hidden !important; }');
		
			while(true) {
					(function() {
						const overlayelements = document.getElementsByClassName("element-group");
						for (var step = 0; step < overlayelements.length; step++)
						{
							if (overlayelements[step].getElementsByClassName("wrap overlay premium").length > 0) 
								overlayelements[step].remove();
						}
					}
        )();
					(function() {
						const overlayelements = document.getElementsByClassName("element-group");
						for (var step = 0; step < overlayelements.length; step++)
						{
							if (overlayelements[step].getElementsByClassName("wrap shape premium").length > 0) 
								overlayelements[step].remove();
						}
					}
        )();
					(function() {
						const overlayelements = document.getElementsByClassName("element-group");
						for (var step = 0; step < overlayelements.length; step++)
						{
							if (overlayelements[step].getElementsByClassName("wrap sticker premium").length > 0) 
								overlayelements[step].remove();
						}
					}
        )();
					(function() {
						const overlayelements = document.getElementsByClassName("element-group");
						for (var step = 0; step < overlayelements.length; step++)
						{
							if (overlayelements[step].getElementsByClassName("wrap border premium").length > 0) 
								overlayelements[step].remove();
						}
					}
        )();
					(function() {
						const elements = document.getElementsByClassName("text-box premium");
						while (elements.length > 0) elements[0].remove();
					}
				)
        ();
					(function() {
						const elements = document.getElementsByClassName("font-pod premium");
						while (elements.length > 0) elements[0].remove();
					}
				)
			();
        
      await new Promise(r => setTimeout(r, refresh_rate));
		}
    } else {
      if(document.getElementById("get-premium")) document.getElementById("get-premium").outerHTML = "";
      //document.getElementById("template-carousel").outerHTML = "";
      //document.getElementById("recommended-view-more").outerHTML = "";
      //document.getElementById("template-loading").outerHTML = "";
      
      while(true)
        {
              (function() {
                  const template_elements = document.getElementsByClassName("template-box large");
                  for (var step = 0; step < template_elements.length; step++)
                  {
                      if (template_elements[step].getElementsByClassName("premium").length > 0)
                          template_elements[step].remove();
                  }
              }
          )();
              (function() {
                  const template_elements = document.getElementsByClassName("template-box");
                  for (var step = 0; step < template_elements.length; step++)
                  {
                      if (template_elements[step].getElementsByClassName("premium").length > 0)
                          template_elements[step].remove();
                  }
              }
          )();
          
          await new Promise(r => setTimeout(r, refresh_rate));
        }
    }
}
 
let currentPage = location.href;
 
noPremiumFeatures();
 
setInterval(async function()
{
    if (currentPage != location.href)
    {
        currentPage = location.href;
        noPremiumFeatures();
        
}}, refresh_rate);} catch(err) {} })();
