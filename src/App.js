import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import './App.css';

import MainLayout from './modules/MainLayout/MainLayout';
import Loading from './components/Loading/Loading';
import Logo from './components/Logo/Logo';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


// import store from './redux/store';
// import { history } from './redux/store';

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

  }

  render() {
    return (
      <MuiThemeProvider>
        <MainLayout />
      </MuiThemeProvider>
    );
  }
}

export default App
