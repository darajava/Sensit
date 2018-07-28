import React from 'react';
import moment from 'moment'

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Logo from '../Logo/Logo';

class EnterPin extends React.Component {

  constructor() {
    super();

    this.state = {
      pin: "",
    }
  }
  
  stopPropagation(e) {
    e.stopPropagation();
  }

  removeAttr() {
    alert();
    document.getElementById('pin-input').removeAttribute('readonly');
  }


  render() {

    return (
      <div styleName="container" onClick={this.props.onCancel}>
        <div styleName="modal-container" onClick={this.stopPropagation}>
          <div styleName="title">
            <div>
              Enter PIN
            </div>
          </div>
          <input autocomplete="off" readonly onfocus={() => this.removeAttr()} type="password" id="pin-input" styleName="input" placeholder="••••"/>
          <button styleName="submit" onClick={() => this.props.onEnter(document.getElementById("pin-input").value)}>Submit</button>
        </div>
      </div>
    );
  }
}

export default CSSModules(EnterPin, styles, {allowMultiple: true});
 