import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from '../../components/PrivateRoute';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import LoginView from '../../components/Login/Login';

import { withRouter } from 'react-router-dom'

const history = createHistory();

class Login extends Component {

    constructor() {
      super();

      this.loginUser = this.loginUser.bind(this);
    }

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

        if (json.success) {
          // If we have this, then we should be logged in
          localStorage.setItem('token', json.token);
          // Save logged in user's ID
          console.log(json.id);
          localStorage.setItem('id', json.id);

          this.props.history.push('/home');
        } else {
          alert('Invalid Login')
        }
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
