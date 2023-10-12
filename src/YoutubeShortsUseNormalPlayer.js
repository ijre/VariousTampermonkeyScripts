// ==UserScript==
// @name         Force YouTube Shorts To Use Normal Player
// @author       ijre
// @version      1.0.1.2
// @description  When loading a YouTube shorts video, redirects you to the normal url version instead
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/embed*
// @downloadURL  https://raw.githubusercontent.com/ijre/VariousTampermonkeyScripts/main/src/YoutubeShortsUseNormalPlayer.js
// @updateURL    https://raw.githubusercontent.com/ijre/VariousTampermonkeyScripts/main/src/YoutubeShortsUseNormalPlayer.js
// @grant        window.onurlchange
// @run-at       document-start
// ==/UserScript==

let oldRef = location.href;
let runAtStart = location.pathname.startsWith("/shorts/");

function setNewUrl()
{
  if (!location.pathname.startsWith("/shorts/") || (location.href === oldRef && !runAtStart))
  {
    return;
  }

  let video = location.pathname.substring("/shorts/".length);
  let newRef = location.href.replace(location.pathname, `/watch?v=${video}`);

  location.replace(newRef);

  oldRef = newRef;
}

if (runAtStart)
{
  setNewUrl();
  runAtStart = false;
}

window.addEventListener("urlchange", (url) =>
{
  setNewUrl();
});