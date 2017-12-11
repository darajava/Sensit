import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Message from '../Message/Message';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

const MessageList = (props) => {

  let messageList = [];

  function isDelivered(message) {
    message.deliveredTo.push(localStorage.getItem('id'));

    for (let i = 0; i < message.forUsers.length; i++) {
      if (!message.deliveredTo.includes(message.forUsers[i])) {
        return false;
      }
    }

    return true;
  }

  for (let i = 0; i <= props.messages.length; i++) {
    if (props.messages[i]) {
      messageList.push(
        <Message
          message={props.messages[i]}
          mine={props.messages[i].sentBy === localStorage.getItem('id')}
          isDelivered={isDelivered(props.messages[i])}
        />);
    }
  }

  return (
    <div styleName="list">
      {messageList}
    </div>
  )
}

export default CSSModules(MessageList, styles);
 