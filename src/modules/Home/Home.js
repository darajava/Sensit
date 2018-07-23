import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
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
      chat: false,
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
    this.clearChat = this.clearChat.bind(this);
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
          console.log();
          this.getRecent('chats');
      }
    };
  }

  clearChat() {
    this.setState({chat: false});
  }

  selectChat(roomId, users, user, room) {
    console.log('xxxx', arguments)

    // XXX: I need the double set state for the desktop version, don't know why
    // It switches chats fine on mobile, or after chat manually closed
    this.setState({
      chat: false,
    }, () => this.setState({
      chat: true,
      chatRoomId: roomId,
      chatUsers: users,
      chatUser: user,
      chatRoom: room,
    }));
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

    let chat = (
      <Chat
        roomId={this.state.chatRoomId}
        users={this.state.chatUsers}
        user={this.state.chatUser}
        room={this.state.chatRoom}
        sendUpdate={this.sendUpdate}
        clearChat={this.clearChat}
      />
    );
    
    return (
      <div>
        <Sidebar selectChat={this.selectChat} {...this.state} />
        { this.state.chat && chat }
      </div>
    );
  }
}

export default CSSModules(Home, styles);

// export default connect(mapStateToProps, null)(Chat);
