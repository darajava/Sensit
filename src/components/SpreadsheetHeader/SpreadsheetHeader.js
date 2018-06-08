import React from 'react';
import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

let hash = require('object-hash');

const SpreadsheetHeader = (props) => {

  return (
    <div>
      <div styleName="container">
        <div styleName="top-container">
          <img src="/images/spreadsheet-logo.png" />
          <img src="/images/spreadsheet-logout.png" />
        </div>
        <div styleName="bottom-container">
          <img src="/images/spreadsheet-buttons.png" />
        </div>
      </div>
      <div styleName="container-shadow" />
    </div>
  );
        
}

export default CSSModules(SpreadsheetHeader, styles);
 