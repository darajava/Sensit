import React from 'react';
import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import Menu from '../Menu/Menu';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import {stringToIntHash} from '../../utils/utils';

let hash = require('object-hash');

const RoomHeader = (props) => {

  let image = '';
  let onlineLight = null;
  let dateString = ''; 

  if (typeof props.user !== 'undefined') {

    let iscurrentDate = moment(props.user.lastOnline).isSame(new Date(), "day");
    let isOnline = moment().diff(moment(props.user.lastOnline), 'seconds') < 20;

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
    image = props.user.image ? props.user.image : `https://i.picsum.photos/id/${stringToIntHash(props.user._id)}/100/100.jpg`;
  } else {
    if (props.typing) {
      if (props.currentlyTyping.length === 1) {
        dateString = props.currentlyTyping[0] + ' is typing...';
      } else {
        dateString = 'Several people are typing';
      }
    }
    image = props.room.image ? props.room.image : `https://i.picsum.photos/id/${stringToIntHash(props.room._id)}/100/100.jpg`;
  }


  return (
      <div styleName='room-header'>
        <div styleName='back-button' onClick={props.back}>
          <span styleName='glyph'>
            <Glyphicon glyph="menu-left" />
          </span>  
          <span>
          <img styleName='profile-image' src={image} />
            {onlineLight}    
          </span>
        </div>
        
        <div styleName="user-info">
          <div styleName="username">
            {props.user ? props.user.username : props.room.name}
          </div>
          <div styleName="last-online">
            { dateString }
          </div>
        </div>

        <span styleName="options" onClick={props.showMenu}>
          <Menu
            hideMenu={props.hideMenu}
            show={props.show}
            options={[
              {
                f: () => alert('not implemented'),
                text: "View group info"
              },
              {
                f: () => alert('not implemented'),
                text: "Mute"
              },
              {
                f: () => document.location = '/login',
                text: "Log out"
              },

            ]} />
          <Glyphicon glyph="option-vertical" />
        </span>
      </div>
  );
        
}

export default CSSModules(RoomHeader, styles);
 