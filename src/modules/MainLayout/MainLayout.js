import React , { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
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
          <BrowserRouter history={this.props.history}>
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
                  <PrivateRoute exact path='/' component={Home} isAuthenticated={() => localStorage.getItem('token')} />
                  <PrivateRoute exact path='/chat/:id' component={Chat} isAuthenticated={() => localStorage.getItem('token')} />
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/logout' component={Login} />
                  <Route exact path='/register' component={Register} />
                </Switch>
              </main>
            </div>
          </BrowserRouter>
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
