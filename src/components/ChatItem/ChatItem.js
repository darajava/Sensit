import React from 'react';
import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import {withRouter} from "react-router-dom";

let hash = require('object-hash');

const ChatItem = (props) => {

  return (
    <Link to={{ pathname: "/chat/" + hash([localStorage.getItem('id'), props.user._id].sort()), query: { users: [props.user._id], user: props.user } }} >
      <div styleName='chat-item'>
        <img styleName='profile-image' src={props.user.image ? props.user.image : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' } />
        {props.user.username}
      </div>
    </Link>
  );
        
}

export default withRouter(CSSModules(ChatItem, styles));
 