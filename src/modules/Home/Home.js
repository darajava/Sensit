import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Loading from '../../components/Loading/Loading';
import NewGroup from '../../components/NewGroup/NewGroup';
import Sidebar from '../Sidebar/Sidebar';
import ChatItem from '../../components/ChatItem/ChatItem';
import {Tabs, Tab} from 'material-ui/Tabs';
import Chat from '../Chat/Chat';
import HomeHeader from '../../components/HomeHeader/HomeHeader';

let connection;

class Home extends Component {

  constructor() {
    super();
    this.state = {
      chat: null,
      chats: [],
      chatsLoaded: false,
      users: [],
      usersLoaded: false,
      rooms: [],
      roomsLoaded: false,
      activeIndex: 1,
    }


    this.getRecent = this.getRecent.bind(this);
    // this.checkForNewMessages = this.checkForNewMessages.bind(this);
    this.selectChat = this.selectChat.bind(this);
  }

  componentWillMount() {
    this.getRecent("chats");
    this.getRecent("users");
    this.getRecent("rooms");


    connection = new WebSocket(
      'ws://' + process.env.REACT_APP_CHAT_URL + 
      '?myId=' + localStorage.getItem('id')
    );

    // if user is running mozilla then use its built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    connection.onopen = () => {

    };

    connection.onerror = (error) => {

    };

    connection.onmessage = (message) => {
      let parsedMessage = '';
      try {
        parsedMessage = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like valid JSON: ', message.data);
        return;
      }


      switch (parsedMessage.type) {
        case 'message':        
          this.getRecent('chats');
      }
    };
  }

  selectChat(roomId, users, user, room) {
    console.log('bobobo', arguments )

    // I don't know why I need this double set state
    this.setState({chat: null}, () => {
      this.setState({
        chat: (
          <Chat
            roomId={roomId}
            users={users}
            user={user}
            room={room}
            sendUpdate={this.sendUpdate}
          />
        )}
      );
    });
    
  }

  getRecent(type) {
    let newState = {};

    // newState[type + "Loaded"] = false;
    // this.setState(newState);

    fetch("http://" + process.env.REACT_APP_API_URL + "/" + type, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token'),
      },

      body: JSON.stringify({
        userId: localStorage.getItem('id'),
      }),
    })
    .then( (response) => { 
      return response.json();
    }).then((json) => {
      let results = [];
      for (let key in json) {
        if (json.hasOwnProperty(key)) {
          results.push(json[key]);
        }
      }

      if (type === "users") {
        this.setState({users: results, usersLoaded: true});
      } else if (type === "rooms") {
        this.setState({rooms: results, roomsLoaded: true});
      } else if (type === "chats") {
        results.sort((a, b) => {
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        })

        this.setState({chats: results, chatsLoaded: true});
      }
      // If we have this, then we should be logged in
      // localStorage.setItem('token', json.token);
    });
    // send the message as an ordinary text
  }

  sendUpdate() {
    connection.send(JSON.stringify({
      type: 'update',
    }));
  }

  render() {
    
    return (
      <div>
        <Sidebar selectChat={this.selectChat} {...this.state} />
        { this.state.chat }
      </div>
    );
  }
}

export default CSSModules(Home, styles);

// export default connect(mapStateToProps, null)(Chat);
