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

  function isLastSeen(message) {    
    for (let i = props.messages.length - 1; i >= 0; i--) {
        if (isSeen(props.messages[i])) {
          if (props.messages[i]._id !== message._id) {
            return false;
          } else {
            return true;
          }
        }
    }

    return false;
  }

  function isSeen(message) {
    // console.log('seenby', message.seenBy);
    // console.log(localStorage.getItem('id'));
    if (message.seenBy && message.seenBy.length) {
      for (let i = 0; i < message.seenBy.length; i++) {
        if (message.seenBy[i] !== localStorage.getItem('id')) {
          return true;
        }
      }
    } 

    return false;
  }

  for (let i = 0; i < props.messages.length; i++) {
    if (props.messages[i]) {
      messageList.push(
        <Message
          key={i}
          message={props.messages[i]}
          mine={props.messages[i].sentBy === localStorage.getItem('id')}
          isDelivered={isDelivered(props.messages[i])}
          isSeen={isSeen(props.messages[i])}
          isLastSeen={isLastSeen(props.messages[i])}
        />
      );
    }
  }

  return (
    <div id="message-list" styleName="list">
      {messageList}
    </div>
  )
}

export default CSSModules(MessageList, styles);
 