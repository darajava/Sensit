import React , { Component } from 'react';

import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import Menu from '../Menu/Menu';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'


class NewGroup extends Component {

  constructor() {
    super();
  }


  // todo: here, we have a list of users that we want to pass down into 
  // a select multiple users popup modal so that we can create a room

  // https://github.com/JedWatson/react-select seems to be the way
  // to go to build this. 

  // That modal should be it's own separate component with the name of the room
  // taken from the user aswell

  render() {
    return null;

    // return nothing for now

    return (
        <div styleName='container'>
        New Group...
        {this.props.users.map((u) => <div>{u.username}</div>)}
        </div>
    );
  }
        
}

export default CSSModules(NewGroup, styles);
 