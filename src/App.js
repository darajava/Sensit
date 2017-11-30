import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import './App.css';

import MainLayout from './modules/MainLayout/MainLayout';
import Loading from './components/Loading/Loading';
import Logo from './components/Logo/Logo';

import store from './redux/store';
import { history } from './redux/store';
import './segment';


class App extends Component {
  constructor() {
    super()
    this.state = { rehydrated: false }
  }

  componentWillMount(){
    persistStore(store, {blacklist: ['signupState']}, () => {
      setTimeout( () => {
        this.setState({ rehydrated: true })
      }, 500)
    })
  }

  render() {
    if(!this.state.rehydrated) {
      return(
        <div>
          <Loading />
          <Logo />
        </div>
      );
    }
    return (
      <Provider store={store}>
        <MainLayout history={history} />
      </Provider>
    );
  }
}

export default App
