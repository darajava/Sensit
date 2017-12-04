import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Message from '../Message/Message';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

const MessageList = (props) => {

  let messageList = [];

  for (let i = 0; i <= props.messages.length; i++) {
    if (props.messages[i]) {
      messageList.push(<Message message={props.messages[i].data} mine={props.messages[i].data.userId === localStorage.getItem('id')} />);
    }
  }

  return (
    <div styleName="list">
      {messageList}
    </div>
  )
}

export default CSSModules(MessageList, styles);
 