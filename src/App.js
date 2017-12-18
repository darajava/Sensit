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

    this.addOnlineListener();
  }

  addOnlineListener() {
    let doc = document.getElementById('root');

    let lastInteraction = Date.now();

    doc.onclick = () => {


      console.log(Date.now())
      console.log(lastInteraction)
      console.log(Date.now() - lastInteraction);

      if (Date.now() - lastInteraction > 2000){
        console.log('logging online time');

        fetch("http://" + process.env.REACT_APP_API_URL + "/last-online", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
          },

          body: JSON.stringify({
            'userId': localStorage.getItem('id'),
          }),
        })
        .then( (response) => {
           return response.json();
        }).then((json) => {
          
        }).catch(() => {
          // do nothing
        });
      
        lastInteraction = Date.now();
      }
    };
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
