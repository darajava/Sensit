import React from 'react';
import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

let hash = require('object-hash');

const RoomHeader = (props) => {

  let image = '';
  let onlineLight = null;
  let dateString = ''; 


  if (typeof props.user !== 'undefined') {

    let iscurrentDate = moment(props.user.lastOnline).isSame(new Date(), "day");
    let isOnline = moment().diff(moment(props.user.lastOnline), 'minutes') < 1

    if (props.typing) {
      dateString = 'typing...';
    } else if (isOnline) {
      dateString = 'online';
    } else if (iscurrentDate) {
      dateString = "last seen today at " + moment(props.user.lastOnline).format('h:mma');
    } else {
      dateString = "last seen " + moment(props.user.lastOnline).format('DD/MM/YYYY h:mma');
    }

    onlineLight = <span styleName={isOnline ? 'online-light' : 'offline-light'}/>;
    image = props.user.image ? props.user.image : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
  } else {
    if (props.typing) {
      if (props.currentlyTyping.length === 1) {
        dateString = props.currentlyTyping[0] + ' is typing...';
      } else {
        dateString = 'Several people are typing';
      }
    }
    image = props.room.image ? props.room.image : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
  }


  return (
      <div styleName='chat-item'>
        <div styleName='back-button'>
          <Link to={{ pathname: "/", }} >
            <span styleName='glyph'>
              <Glyphicon glyph="menu-left" />
            </span>
            <span>
            <img styleName='profile-image' src={image} />
              {onlineLight}
            </span>
          </Link>
        </div>
        
        <div styleName="user-info">
          <div styleName="username">
            {props.user ? props.user.username : props.room.name}
            - myuser: {JSON.parse(localStorage.getItem('user')).username}
          </div>
          <div styleName="last-online">
            { dateString }
          </div>
        </div>

        <span styleName="options">
          <Glyphicon glyph="option-vertical" />
        </span>
      </div>
  );
        
}

export default CSSModules(RoomHeader, styles);
 