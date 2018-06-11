import React from 'react';
import moment from 'moment'

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

export function returnRich (text) {
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

export function decode(html) {
  let text = document.createElement('textarea');
  text.innerHTML = html;

  let value = text.value.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
    return '&#'+i.charCodeAt(0)+';';
  });

  let yt = hasYoutube(value);

  if (yt.length) {
    return returnRich('<iframe width="420" height="315" src="https://www.youtube.com/embed/' + yt + '"></iframe>');
  }




  let bold = /\*(.*)\*/;
  let italic = /_(.*)_/;

  return returnRich(value);
}

function changeColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}

let stringToColor = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var color = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

const Message = (props) => {

  let delivered = <span styleName="sent-icon"><Glyphicon glyph="ok" /></span>;
  
  if (props.isLastSeen) {
    delivered = (
      <span styleName="seen-image">
        <img src={
          props.user && props.user.image
            ? props.user.image
            : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' }
            />
      </span>
    );
  } else if (props.isSeen) {
    let fadeStyle = styles["seen-image"] + " " + styles["fade-out"];
    delivered = (
      <span className={fadeStyle}>
        <img src={
          props.user && props.user.image
            ? props.user.image
            : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' }
            />
      </span>
    );
  } else if (props.isDelivered) {
    delivered = <span styleName="delivered-icon"><Glyphicon glyph="ok" /></span>;
  } else if (props.message.fake) {
    delivered = <span styleName="pending-icon"><Glyphicon glyph="time" /></span>
  }

  let bang = '';

  if (props.message.text.length < 50 && props.message.text.indexOf('!') > -1) {
    if (props.message.text.indexOf('!!') > -1) {
      bang = 'louder';
    } else {
      bang = 'loud';
    }
  }

  let username = '';

  if (props.isGroup && !props.mine) {
    let nameColor = stringToColor(props.username);
    username = (
      <div>
        <div styleName="username-hint" style={{color: nameColor, borderBottom: "1px solid " + changeColor(nameColor, 190)}}>
          {props.username}
        </div>
      </div>
    );
  }

  return (
    <div styleName='message-holder'>
      <div styleName={props.mine ? 'my-message' : 'your-message'}>
        {username}
        <span styleName={bang}>
          {decode(props.message.text)}
        </span>
        <span styleName="info">
          <div styleName="time">
            {moment(props.message.createdAt).format('h:mm a')}
          </div>
          {props.mine && 
            <div styleName="delivered">
              {delivered}
            </div>
          }
        </span>
      </div>
    </div>
  );
}

export default CSSModules(Message, styles);
 