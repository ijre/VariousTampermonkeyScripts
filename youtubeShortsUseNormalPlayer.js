// ==UserScript==
// @name         Force YouTube Shorts To Use Normal Player
// @author       ijre
// @version      1.0.1.0
// @description  When loading a YouTube shorts video, redirects you to the normal url version instead
// @match        *://*.youtube.com/*
// @downloadURL  https://gist.githubusercontent.com/ijre/d4854775f1a63b2ffed44bef34d8719a/raw/youtubeShortsUseNormalPlayer.js
// @updateURL    https://gist.githubusercontent.com/ijre/d4854775f1a63b2ffed44bef34d8719a/raw/youtubeShortsUseNormalPlayer.js
// @grant        window.onurlchange
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