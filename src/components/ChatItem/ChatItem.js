import React from 'react';
import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import {withRouter} from "react-router-dom";
import {stringToIntHash, decode} from '../../utils/utils';

let hash = require('object-hash');

const ChatItem = (props) => {

  let clickHandler, imageUrl, lastMessage, time, roomName;

  if (typeof props.user === "undefined") {
    // if the room was autogenerated (i.e. a natural 2-person chat)
    // then don't show it unless we specifically ask it to (i.e. passing the chat flag in)
    if (props.room.autogenerated && !props.chat) return null;

    // same if it's a group
    if (props.room.autogenerated && props.group) return null;

    // if we specifically ask for the chat, and it's not autogenerated
    // then we need to set the name for it ourselves 
    if (props.chat && props.room.autogenerated) {
      for (let i = 0; i < props.users.length; i++) {
        if (props.users[i]._id !== localStorage.getItem('id') && props.room.users.includes(props.users[i]._id)) {
          props.room.name = props.users[i].username;
          break;
        }
      }
    }

    clickHandler = () => props.selectChat(props.room._id, props.room.users, undefined, props.room);

    imageUrl = props.room.image ? props.room.image : 'https://picsum.photos/' + stringToIntHash(props.room._id);
    roomName = props.room.name;
  } else {
    clickHandler = () => {
      props.selectChat(
        hash([localStorage.getItem('id'), props.user._id].sort()),
        [props.user._id],
        props.user
      );
    }
    imageUrl = props.user.image
      ? props.user.image
      : 'https://picsum.photos/' + stringToIntHash(props.user._id);
      roomName = props.user.username;
  }

  if (typeof props.room !== 'undefined') {
    lastMessage = props.room.lastMessage;
    time = moment(props.room.lastMessageTime).format('h:mm a');
  }

  return (
    <div onClick={clickHandler} styleName='chat-item'>
      <img styleName='profile-image' src={imageUrl} />
      <div styleName="content-holder">
        <div>
          <span styleName="room">
            {roomName}
          </span>
          <span styleName="time">
            {time}
          </span>
        </div>
        <div styleName="last-message">
          {lastMessage ? decode(lastMessage) : 'Status...'}
        </div>
      </div>
    </div>
  );
        
}

export default withRouter(CSSModules(ChatItem, styles));