import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

const Loading = (props) => {
  return (
    <div styleName="container">
      <div styleName={"loading " + (props.message ? "message" : "")}>
        <div></div>
      </div>
    </div>
  )
}

export default CSSModules(Loading, styles, {allowMultiple: true});
 