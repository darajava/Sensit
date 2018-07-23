import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {returnRich} from '../Message/Message';
import ReactDOMServer from 'react-dom/server';


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

    document.getElementById('message-box').focus();
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
 