import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {returnRich} from '../Message/Message';
import ReactDOMServer from 'react-dom/server';


const InputArea = (props) => {

  let sendMessage = (e, sensitive) => {
    if (e.key === 'Enter' || typeof e.key === 'undefined') {
      e.preventDefault();

      if (!props.sensit) {
        props.showSensit();

        return;
      }
      props.sendMessage(document.getElementById('message-box').innerHTML, !!sensitive);
      document.getElementById('message-box').innerHTML = '';
      props.typing(false);

      props.hideSensit();
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

  let sensitButton = props.sensit && <button styleName="send-select abs lock" onClick={(e) => sendMessage(e, true)} />;

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
      <div styleName="button-container">
        <button styleName="send-select">
          <span styleName="glyph-position">
            <Glyphicon glyph="send" onClick={props.sensit ? sendMessage : props.showSensit} />
          </span>
        </button>
        {sensitButton}
      </div>
    </div>
  )
}

export default CSSModules(InputArea, styles, {allowMultiple: true});
 