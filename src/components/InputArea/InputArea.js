import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {returnRich} from '../Message/Message';
import ReactDOMServer from 'react-dom/server';

function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

const InputArea = (props) => {

  let sendMessage = (e) => {
    if (e.key === 'Enter' || typeof e.key === 'undefined') {
      e.preventDefault();
      props.sendMessage(document.getElementById('message-box').innerHTML);
      document.getElementById('message-box').innerHTML = '';
      props.typing(false);
    } else {
      if (e.key.length == 1) {
        props.typing(true);
        let elem = document.getElementById('message-box');
        // elem.innerHTML = ReactDOMServer.renderToStaticMarkup(
        //   returnRich(elem.innerHTML)
        // );
        // setEndOfContenteditable(elem);
      }
    }
  };

  return (
    <div styleName="bottom" id="seen">
      <div styleName="input-holder">
        <span
          id="message-box"
          styleName="main-input"
          placeholder="Type your message..."
          onKeyDown={sendMessage}
          contentEditable="true">
        </span>
      </div>
      <button styleName="send-select">
        <span styleName="glyph-position">
          <Glyphicon glyph="send" onClick={sendMessage} />
        </span>
      </button>
    </div>
  )
}

export default CSSModules(InputArea, styles);
 