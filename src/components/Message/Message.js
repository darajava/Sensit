import React from 'react';
import moment from 'moment'

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

const Message = (props) => {

  let delivered = <span styleName="sent-icon"><Glyphicon glyph="ok" /></span>;

  if (props.message.fake) {
    delivered = <span styleName="pending-icon"><Glyphicon glyph="time" /></span>
  }

  if (props.isDelivered) {
    delivered = <span styleName="delivered-icon"><Glyphicon glyph="ok" /></span>;
  }

  let bang = '';

  if (props.message.text.length < 50 && props.message.text.indexOf('!') > -1) {
    if (props.message.text.indexOf('!!') > -1) {
      bang = 'louder';
    } else {
      bang = 'loud';
    }
  }

  // TODO: Seen

  function decode(html) {
    let text = document.createElement('textarea');
    text.innerHTML = html;

    let value = text.value;

    let bold = /\*(.*)\*/;
    let italic = /_(.*)_/;

    // TODO lol get bold working... it's possible but will take some thinking
    // value = value.replace(bold, <b>{'$1'}</b>).replace(italic, '<i>$1</i>')

    return value;
  }

  return (
    <div styleName='message-holder'>
      <div styleName={props.mine ? 'my-message' : 'your-message'}>
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
 