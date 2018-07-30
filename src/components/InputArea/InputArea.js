import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {returnRich} from '../Message/Message';
import TakePhoto from '../TakePhoto/TakePhoto';
import ReactDOMServer from 'react-dom/server';


const InputArea = (props) => {

  let sendMessage = (e, sensitive) => {

    if (e.which === 13 || typeof e.which === 'undefined') {
      e.preventDefault();

      if (!props.sensit) {
        props.showSensit();

        return;
      }
      props.sendMessage(document.getElementById('message-box').innerHTML, !!sensitive);
      document.getElementById('message-box').innerHTML = '';
      props.typing(false);

      props.hideSensit();
    } 

    document.getElementById('message-box').focus();
  };

  let sendTyping = () => {
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
        <span
          id="message-box"
          styleName="main-input"
          placeholder="Type your message..."
          onKeyDown={sendMessage}
          onKeyUp={sendTyping}
          contentEditable="true">

        </span>
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
 