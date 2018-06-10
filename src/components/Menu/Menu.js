import React from 'react';
import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'


const Menu = (props) => {

  if (!props.show) return null;

  let entries = [];

  for (let i = 0; i < props.options.length; i++) {
    entries.push(
      <div styleName="menu-item" key={i} onClick={props.options[i].f}>
        {props.options[i].text}
      </div>
    );
  }

  document.body.onclick = (e) => {
    if (e.srcElement.parentElement.id !== 'menu-list') {
      document.getElementById('menu-list') && (document.getElementById('menu-list').className += " " + styles['fade-out']);
      props.hideMenu();
    }
  }

  return (
      <div id="menu-list" className={styles['fade-in']} styleName="menu">
        {entries}
      </div>
  );
        
}

export default CSSModules(Menu, styles);
 