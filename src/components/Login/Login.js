import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { Link } from 'react-router-dom';

import Logo from '../Logo/Logo';

const Login = (props) => {

  return (
    <div styleName="background">
      <div styleName="loginBox">
        <Logo login={true} />
        <input styleName="input" id="username" type="text" name="username" placeholder="Username" />
        <input styleName="input" id="password" type="password" name="password" placeholder="Password" />

        <button styleName="input" type="submit" onClick={
          () =>
          props.loginUser(
            document.getElementById('username').value,
            document.getElementById('password').value
          )
        }>
          Login
        </button>

        <Link to='/register'>Don't have an account? Register here</Link>
      </div>
    </div>
  )
}

export default CSSModules(Login, styles);
 