import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

const InputArea = (props) => {

  return (
    <div styleName="bottom">
      <div styleName="input-holder">
        <span id="message-box" styleName="main-input" placeholder="Type your message..." contentEditable="true"></span>
      </div>
      <button styleName="send-select">
        <span styleName="glyph-position">
          <Glyphicon glyph="send" onClick={() => props.sendMessage(document.getElementById('message-box').innerHTML) } />
        </span>
      </button>
    </div>
  )
}

export default CSSModules(InputArea, styles);
 