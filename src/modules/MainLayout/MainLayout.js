import React , { Component } from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import Login from '../Login/Login';
import Logout from '../../components/Login/Logout';
import Register from '../Register/Register';
import Chat from '../Chat/Chat';
import Home from '../Home/Home';

class MainLayout extends Component {

    render() {
      return (
        <div>
          <HashRouter history={this.props.history}>
            <div className="app">
              <main>
                <Switch>
                  <PrivateRoute exact path='/' component={Home} isAuthenticated={() => localStorage.getItem('token')} />
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/logout' component={Login} />
                  <Route exact path='/register' component={Register} />
                </Switch>
              </main>
            </div>
          </HashRouter>
        </div>
        );
    }
}

// function mapStateToProps(state) {
//   return {
//     sessionData: state.getIn(['loginState', 'sessionData']),
//   }
// }

export default MainLayout;
