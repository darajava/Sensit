import React from 'react';
import moment from 'moment'

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

const Message = (props) => {

  return (
    <div styleName='message-holder'>
      <div styleName={props.mine ? 'my-message' : 'your-message'}>
        {props.message.text}
        <div styleName="time">{moment(props.message.time).format('h:mm a')}</div>
      </div>
    </div>
  );
}

export default CSSModules(Message, styles);
 