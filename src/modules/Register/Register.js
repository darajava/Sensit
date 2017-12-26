import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import RegisterView from '../../components/Login/Register';


class Register extends Component {

    registerUser(username, password) {
      fetch("http://" + process.env.REACT_APP_API_URL + "/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          username,
          password,
        })
      })
      .then( (response) => { 
         console.log(response);
      });
    }

    render() {
      return ( 
        <div>
          <RegisterView registerUser={this.registerUser} />
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    sessionData: state.getIn(['loginState', 'sessionData']),
  }
}

export default Register;
