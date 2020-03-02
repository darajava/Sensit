import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {returnRich} from '../Message/Message';
import TakePhoto from '../TakePhoto/TakePhoto';
import ReactDOMServer from 'react-dom/server';


const InputArea = (props) => {

  let sendMessage = (e, sensitive) => {
    console.log(e.which);

    if (e.which === 13 || typeof e.keyCode === 'undefined') {
      e.preventDefault();

      if (!props.sensit) {
        props.showSensit();

        return;
      }

      props.sendMessage(document.getElementById('message-box').innerText, !!sensitive);
      document.getElementById('message-box').innerText = '';
      props.typing(false);

      props.hideSensit();
    } 

    document.getElementById('message-box').focus();
  };

  let sendTyping = (e) => {
    const keycode = e.which;
    const valid = 
      (keycode > 47 && keycode < 58)   || // number keys
      keycode == 32 || // spacebar
      (keycode > 64 && keycode < 91)   || // letter keys
      (keycode > 95 && keycode < 112)  || // numpad keys
      (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
      (keycode > 218 && keycode < 223);   // [\]' (in order)

    if (valid) 
      props.typing(true);
  }

  let showSensit = (e) => {
    document.getElementById('message-box').focus();
    props.showSensit(e);
  }

  let sensitButton = props.sensit && <button styleName="send-select abs lock" onClick={(e) => sendMessage(e, true)} />;

  return (
    <div styleName="bottom" id="seen">

      <div styleName="input-holder">
        <div
          id="message-box"
          styleName="main-input"
          placeholder="Type your message..."
          onKeyDown={sendMessage}
          onKeyUp={sendTyping}
          contentEditable
        >

        </div>
        <div styleName="right">
          <TakePhoto sendPhoto={props.sendPhoto}/>
        </div>
      </div>
      <div styleName="button-container">
        <button styleName="send-select">
          <span styleName="glyph-position">
            <Glyphicon glyph="send" onClick={props.sensit ? sendMessage : showSensit} />
          </span>
        </button>
        {sensitButton}
      </div>
    </div>
  )
}

export default CSSModules(InputArea, styles, {allowMultiple: true});
 