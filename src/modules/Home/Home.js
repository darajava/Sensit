import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Loading from '../../components/Loading/Loading';
import ChatItem from '../../components/ChatItem/ChatItem';

class Home extends Component {

  constructor() {
    super();

    this.state = {
      chats: [],
      chatsLoaded: false,
    }

    this.getRecentChats = this.getRecentChats.bind(this);
  }

  componentWillMount() {
    this.getRecentChats();
  }

  getRecentChats() {
    this.setState({chatsLoaded: false});

    fetch("http://localhost:1337/chats", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token'),
      },
    })
    .then( (response) => { 
       return response.json();
    }).then((json) => {
      let chats = [];
      for (let key in json) {
        if (json.hasOwnProperty(key)) {
          chats.push(json[key]);
        }
      }

      console.log(chats);

      this.setState({chats, chatsLoaded: true});
      // // If we have this, then we should be logged in
      // localStorage.setItem('token', json.token);
    });
    // send the message as an ordinary text
  }

  render() {

    let chats = [];
    for (let i = 0; i < this.state.chats.length; i++) {
      chats[i] =
        <div key={i}>
          <ChatItem user={this.state.chats[i]} />
        </div>;
    }

    return (
      <div>
        {!this.state.chatsLoaded && <Loading />}
        {this.state.chatsLoaded && chats}
      </div>
    );
  }
}

export default CSSModules(Home, styles);

// export default connect(mapStateToProps, null)(Chat);
