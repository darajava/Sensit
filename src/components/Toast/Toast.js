import React from 'react';
import moment from 'moment'

import CSSModules from 'react-css-modules';
import styles from './styles.css';


const Toast = (props) => {

  return (
    <div styleName="container">
      <div styleName="toast">
        <div>
          {props.message}
        </div>
      </div>
    </div>
  );
}

export default CSSModules(Toast, styles);
 