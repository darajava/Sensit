import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

const Logo = (props) => {

  return (
    <div styleName={!props.inline ? (props.login ? "login" : "center") : 'inline'}>
      <div styleName="logo">
        WhatsApp... eh I mean <span styleName="sens">Sens</span><span styleName="it">it</span>
      </div>
    </div>
  )
}

export default CSSModules(Logo, styles);
 