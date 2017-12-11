import React from 'react';
import moment from 'moment'

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

const Message = (props) => {

  let delivered = <Glyphicon glyph="time" />;

  if (props.isDelivered) {
    delivered = <Glyphicon glyph="ok" />;
  }

  let bang = '';

  if (props.message.text.length < 30 && props.message.text.endsWith('!')) {
    if (props.message.text.endsWith('!!')) {
      bang = 'louder';
    } else {
      bang = 'loud';
    }
  }

  // TODO: Seen

  // Also TODO: proper pending/sent/delivered. Currently, pending isn't shown, sent is shown as pending
  // and delivered is shown as sent. To fix this we need to fake the message on the frontend until it's
  // sent to the server. Then at least we will have the first three stages down properly (pending/sent/delivered)

  return (
    <div styleName='message-holder'>
      <div styleName={props.mine ? 'my-message' : 'your-message'}>
        <span styleName={bang}>
          {props.message.text}
        </span>
        <span styleName="info">
          <div styleName="time">
            {moment(props.message.time).format('h:mm a')}
          </div>
          <div styleName="delivered">
            {delivered}
          </div>
        </span>
      </div>
    </div>
  );
}

export default CSSModules(Message, styles);
 