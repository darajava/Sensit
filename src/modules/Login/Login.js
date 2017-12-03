import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from '../../components/PrivateRoute';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import LoginView from '../../components/Login/Login';


const history = createHistory();

class Login extends Component {

    loginUser(username, password) {
      fetch("http://localhost:1337/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          username,
          password,
        }),
      })
      .then( (response) => { 
         return response.json();
      }).then((json) => {
        console.log(json.token);

        // If we have this, then we should be logged in
        localStorage.setItem('token', json.token);
      });
    }

    render() {
      return (
        <div>
          <LoginView loginUser={this.loginUser} />
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    sessionData: state.getIn(['loginState', 'sessionData']),
  }
}

export default connect(mapStateToProps, null)(Login);
