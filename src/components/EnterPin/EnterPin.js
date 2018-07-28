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

    setTimeout(() => {
      document.getElementById('pin-input').focus();
    }, 0); 
  }
  
  stopPropagation(e) {
    e.stopPropagation();
  }

  removeAttr() {
    document.getElementById('pin-input').removeAttribute('readonly');
  }

  submit = (e) => {
    if ((e && e.keyCode === 13) || typeof e === "undefined") {
      this.props.onEnter(document.getElementById("pin-input").value);
    }
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
          <input autoComplete="off" onKeyUp={this.submit} readOnly onFocus={() => this.removeAttr()} type="password" id="pin-input" styleName="input" placeholder="••••"/>
          <button styleName="submit" onClick={() => this.submit()}>Submit</button>
        </div>
      </div>
    );
  }
}

export default CSSModules(EnterPin, styles, {allowMultiple: true});
 