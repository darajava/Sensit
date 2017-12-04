import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { Link } from 'react-router-dom';

const Login = (props) => {

  return (
    <div>
      <input id="username" type="text" name="username" />
      <input id="password" type="password" name="password" />

      <button type="submit" onClick={
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
  )
}

export default CSSModules(Login, styles);
 