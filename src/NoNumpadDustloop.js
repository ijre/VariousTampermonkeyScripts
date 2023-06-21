// ==UserScript==
// @name         Un-Numpad-ify Dustloop for Guilty Gear
// @author       ijre
// @version      1.1.0.5
// @description  "Ah yes, I press 6 to turn right at this intersection. *fuckign dies*"
// @match        https://www.dustloop.com/w/GG*/*
// @icon         https://i.imgur.com/ZfLl5sW.png
// @downloadURL  https://raw.githubusercontent.com/ijre/VariousTampermonkeyScripts/main/src/NoNumpadDustloop.js
// @updateURL    https://raw.githubusercontent.com/ijre/VariousTampermonkeyScripts/main/src/NoNumpadDustloop.js
// @grant        none
// ==/UserScript==

(function()
{
  const Dirs =
  {
    "1": "↙",
    "2": "↓",
    "3": "↘",
    "4": "←",
    "6": "→",
    "7": "↖",
    "8": "↑",
    "9": "↗"
  };

  const Moves =
  {
    "P":  "Punch",
    "K":  "Kick",
    "S":  "Slash",
    "H":  "Heavy Slash",
    "HS": "Heavy Slash",
    "D":  "Dust"
  };

  let Specials =
  {
  }

  function SpecialNames(text)
  {
    let buff = "";

    for (let char = 0; char < text.length; char++)
    {
      if (text[char] === "[" || text[char] === "]")
      {
        buff += text[char] + ((text[char] === "]" && isNaN(text[char + 1])) ? " " : "");
        continue;
      }

      if (Dirs[text[char]] !== undefined)
      {
        buff += Dirs[text[char]];
      }
      else if (Moves[text[char]] !== undefined)
      {
        buff += Moves[text[char]];
      }
    }

    return buff;
  }

  let colourfulRaw = { };

  for (let colourLevel = 1; colourLevel < 6; colourLevel++)
  {
    let specialsRaw = document.querySelectorAll(`span.input-badge b span.colorful-text-${colourLevel}`);
    for (let specDex = Specials.length; specDex < specialsRaw.length; specDex++)
    {
      Specials[specDex] = SpecialNames(specialsRaw[specDex].textContent.toUpperCase());
    }

    colourfulRaw = document.getElementsByClassName(`colorful-text-${colourLevel}`);
    let colourfulRawSize = colourfulRaw.length;

    for (let i = 0; i < colourfulRawSize; i++)
    {
      if (colourfulRaw[i].parentElement.className === "TheoryBoxDifficulty")
      {
        continue;
      }

      let textRaw = colourfulRaw[i].innerText;
      let hasTextNode = colourfulRaw[i].childNodes[0].nodeName === "#text";

      if (!hasTextNode)
      {
        textRaw = colourfulRaw[i].childNodes[0].childNodes[0].textContent;
      }

      let text = textRaw.toUpperCase();

      function updateElement()
      {
        if (text !== colourfulRaw[i].innerText.toUpperCase())
        {
          hasTextNode ? colourfulRaw[i].innerText = text : colourfulRaw[i].childNodes[0].childNodes[0].textContent = text;
        }
      }

      if (Specials[text] !== undefined)
      {
        text = Specials[text];
      }
      else if (text[0] === "5")
      {
        if (text[1] === "[")
        {
          text = `[${Moves.D}]`; // dust (5D) is the only non-command normal that can be charged; also sometimes the site says "charge 5[D]" so clearly no one knows what the fuck is going on
        }
        else
        {
          text = Moves[text[1]];
        }
      }
      else if (textRaw.startsWith("j."))
      {
        text = "Jumping " + SpecialNames(text.substring(2));
      }
      else if (textRaw.startsWith(".S", 1))
      {
        let distance = textRaw[0] === "c" ? "Close" : "Far";
        let rekkaNum = textRaw.match(/S/g)?.length;

        if (distance === "Close" || rekkaNum <= 1)
        {
          text = `${distance} Slash`;
        }
        else
        {
          text = `${distance} Slash ${rekkaNum}`;
        }
      }
      else
      {
        text = SpecialNames(text);
      }

      updateElement();
    }
  }
})();