import React from 'react';
import moment from 'moment'

import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import {withRouter} from "react-router-dom";

import Logo from '../Logo/Logo';


const HomeHeader = (props) => {

  return (
      <div>
        <Logo inline={true} />
      </div>
  );
        
}

export default withRouter(CSSModules(HomeHeader, styles));
 