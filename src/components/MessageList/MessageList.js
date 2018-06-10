import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Message from '../Message/Message';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import {isDelivered, isSeen, isLastSeen} from '../../messageUtils';

const MessageList = (props) => {

  let messageList = [];

  console.error(props.messages);

  for (let i = 0; i < props.messages.length; i++) {
    if (props.messages[i]) {
      messageList.push(
        <Message
          key={i}
          message={props.messages[i]}
          isGroup={props.isGroup}
          username={props.messages[i].sentByUsername ? props.messages[i].sentByUsername : 'dunno'}
          mine={props.messages[i].sentBy === localStorage.getItem('id')}
          isDelivered={isDelivered(props.messages[i])}
          isSeen={isSeen(props.messages[i])}
          isLastSeen={isLastSeen(props.messages[i], props)}
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
 