import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from '../../components/PrivateRoute';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Chat from '../Chat/Chat';
import Home from '../Home/Home';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

class MainLayout extends Component {

    render() {
      return (
        <div>
          <ConnectedRouter history={history}>
            <div className="app">
              <header className="primary-header">
                <Switch>
                  <Route path='/login' component={null}/>
                  <Route path='/signup' component={null}/>
                  <Route path='/reset' component={null}/>
                  <Route path='/download' component={null}/>
                </Switch>
              </header>

              <main>
                <nav>
                  <Switch>
                    <Route path='/login' component={null}/>
                    <Route path='/signup' component={null}/>
                    <Route path='/reset' component={null}/>
                    <Route path='/submit' component={null}/>
                    <Route path='/download' component={null}/>
                  </Switch>
                </nav>
                <Switch>
                  <Route path='/login' component={Login} />
                  <Route path='/register' component={Register} />
                  <PrivateRoute path='/home' component={Home} isAuthenticated={localStorage.getItem('token')} />
                </Switch>
              </main>
            </div>
          </ConnectedRouter>
        </div>
        );
    }
}

function mapStateToProps(state) {
  return {
    sessionData: state.getIn(['loginState', 'sessionData']),
  }
}

export default connect(mapStateToProps, null)(MainLayout);
