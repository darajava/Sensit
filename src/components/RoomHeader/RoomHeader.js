import React from 'react';
import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

let hash = require('object-hash');

const RoomHeader = (props) => {

  let iscurrentDate = moment(props.user.lastOnline).isSame(new Date(), "day");
  let isOnline = moment().diff(moment(props.user.lastOnline), 'minutes') < 1

  let dateString; 

  if (isOnline) {
    dateString = 'online';
  } else if (iscurrentDate) {
    dateString = "last seen today at " + moment(props.user.lastOnline).format('h:mma');
  } else {
    console.log(props.user.lastOnline)
    dateString = "last seen " + moment(props.user.lastOnline).format('DD/MM/YYYY h:mma');
  }

  return (
      <div styleName='chat-item'>
        <div styleName='back-button'>
          <Link to={{ pathname: "/", }} >
            <span styleName='glyph'>
              <Glyphicon glyph="menu-left" />
            </span>
            <span>
            <img styleName='profile-image' src={props.user.image ? props.user.image : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' } />
              <span styleName={isOnline ? 'online-light' : 'offline-light'}/>
            </span>
          </Link>
        </div>
        
        <div styleName="user-info">
          <div styleName="username">
            {props.user.username}
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
 