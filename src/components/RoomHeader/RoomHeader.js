import React from 'react';
import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

let hash = require('object-hash');

const RoomHeader = (props) => {

  return (
      <div styleName='chat-item'>
        <Link to={{ pathname: "/home", }} >
            <span styleName='glyph'>
              <Glyphicon glyph="menu-left" />
            </span>

            <img styleName='profile-image' src={props.user.image ? props.user.image : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' } />
        </Link>
        
        <span styleName="username">
          {props.user.username}
        </span>


        <span styleName="username">
          { moment(props.user.lastOnline).format('h:mm:ss a') }
          { typeof props.user.lastOnline }
        </span>

        <span styleName="options">
          <Glyphicon glyph="option-vertical" />
        </span>
      </div>
  );
        
}

export default CSSModules(RoomHeader, styles);
 