import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

const Register = (props) => {

  return (
    <div>
      <input id="username" type="text" name="username" />
      <input id="password" type="password" name="password" />

      <button type="submit" onClick={
        () =>
        props.registerUser(
          document.getElementById('username').value,
          document.getElementById('password').value
        )
      }>Register</button>
    </div>
  )
}

export default CSSModules(Register, styles);
 