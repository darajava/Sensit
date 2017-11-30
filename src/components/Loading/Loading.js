import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

const Loading = (props) => {

  return (
    <div styleName="center">
      <div styleName="loading">
        <div></div>
      </div>
    </div>
  )
}

export default CSSModules(Loading, styles);
 