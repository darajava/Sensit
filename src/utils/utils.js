import React from 'react';

export function stringToIntHash(str, upperbound, lowerbound) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = result + (str.charCodeAt(i) * 113);
  }

  if (!lowerbound) lowerbound = 100;
  if (!upperbound) upperbound = 500;

  return (result % (upperbound - lowerbound)) + lowerbound;
}

function strip(html){
   var doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
}

function hasYoutube(url) {
  var regExp = /.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return false;
  }
}

function returnRich (text) {
  var bold = /\*(\S([^*.]*?\S)?)\*/gm;
  var html = text.replace(bold, '<strong>$1</strong>');  
  
  var italic = /_(\S([^*.]*?\S)?)_/gm;
  var html = html.replace(italic, '<i>$1</i>');  
  
  var blink = /\^(\S([^*.]*?\S)?)\^/gm;
  var html = html.replace(blink, '<blink class="blink-text">$1</blink>');         
    
  return (
    <span dangerouslySetInnerHTML={{__html: html}} />
  )

}

export function decode(html, noYt) {
  let text = document.createElement('textarea');
  text.innerHTML = html;

  let value = text.value.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
    return '&#'+i.charCodeAt(0)+';';
  });

  let yt = hasYoutube(value);

  if (yt.length && !noYt) {
    return returnRich('<iframe src="https://www.youtube.com/embed/' + yt + '"></iframe>');
  }

  return returnRich(value);
}