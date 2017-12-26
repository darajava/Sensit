import React , { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from '../../components/PrivateRoute';
import Loading from '../../components/Loading/Loading';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import LoginView from '../../components/Login/Login';

import { withRouter } from 'react-router-dom'

const history = createHistory();

class Login extends Component {

    constructor() {
      super();

      this.state = {
        redirect: false,
      }

      this.loginUser = this.loginUser.bind(this);
    }

    loginUser(username, password) {
      fetch("http://" + process.env.REACT_APP_API_URL + "/login", {
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
          localStorage.setItem('id', json.id);

          this.setState({ loading: true })

          setTimeout(() => {
            this.setState({ redirect: true })
          }, 400);
        } else {
          alert('Invalid Login')
        }
      });
    }

    render() {
      if (this.state.redirect) {
        return <Redirect exact to='/'/>;
      }


      if (this.state.loading) {
        return <Loading />;
      } else {
        window.localStorage.clear(); // Always log the user out
      }

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

export default Login;
