/************
      *
      *
      *
      *
      * O D O

  This file has gotten out of hand. It's pretty simple but could be split up. Some ideas:

  - Split "sending info" and "recieving info" into separate ultility files.
  - Lot of "marking as/confirming" might be able to be logically separated.
  - Maybe have a more clever way to abstract props to make the render method slimmer.
  - Some of the functional methods from the child stateless components are starting to leak up,
    (e.g. showMenu) and I feel that they don't belong in this component. maybe another layer
    of abstraction is needed?
  - websockets as a whole can definitely be abstracted out of here, even if the first point is not valid
                                                              
*/





























import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import InputArea from '../../components/InputArea/InputArea';
import MessageList from '../../components/MessageList/MessageList';
import Spreadsheet from '../../components/Spreadsheet/Spreadsheet';
import { ConnectedRouter } from 'react-router-redux';
import CSSModules from 'react-css-modules';
import RoomHeader from '../../components/RoomHeader/RoomHeader';

import styles from './styles.css';

let connection, checkOnlineInterval;

class Chat extends Component {
  constructor(props) {
    super(props);

    this.typingTimeout = null;
    this.room = props.roomId;

    this.updateTyping = this.updateTyping.bind(this);
    this.handleReciept = this.handleReciept.bind(this);
    this.goIncognito = this.goIncognito.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.back = this.back.bind(this);
  }


  componentWillMount() {
    let props = this.props;
    this.scrolled = false;


    // If we don't get props (i.e. hot reload or page reload)
    // Then get them from localstorage
    // if (typeof props.location.query === 'undefined') {
    //   props.roomId = JSON.parse(localStorage.getItem('chatInfo' + this.room));
    // } else {
    //   // otherwise save them to localstorage
    //   localStorage.setItem('chatInfo' + this.room, JSON.stringify(props.roomId));
    // }

    // console.error(props.location.query);

    this.state = {
      messages: [],
      currentlyTyping: [],
      loadingMessages: true,
      users: props.users,
      user: props.user,
      room: props.room,
    };

    let users = encodeURIComponent(JSON.stringify(props.users));

    this.getMessages(this.room)

    connection = new WebSocket(
      'ws://' + process.env.REACT_APP_CHAT_URL + '?room=' + this.room +
      '&users=' + users +
      '&myId=' + localStorage.getItem('id')
    );

    setInterval(() => {
      this.scrollToBottom()
    }, 100)

    // if user is running mozilla then use its built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    connection.onopen = () => {
      // connection is opened and ready to use
      // alert('opened');
    };

    connection.onerror = (error) => {
      // an error occurred when sending/receiving data
      // alert('error');
      console.error(error)
    };

    connection.onmessage = (message) => {
      // try to decode json (I assume that each message
      // from server is json)
      let parsedMessage = '';
      try {
        parsedMessage = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like valid JSON: ', message.data);
        return;
      }

      // This will break any socket request that doesn't contain 'room'
      // Update them rather than move this
      if (parsedMessage.data.room !== this.room) {
        return;
      }

      switch (parsedMessage.type) {
        case 'deliver-reciept':
          this.handleReciept(parsedMessage, 'deliveredTo');

          break;

        case 'seen-reciept':
          this.handleReciept(parsedMessage, 'seenBy');

          break;
        case 'typing':
          if (parsedMessage.data) {
            let whoTyping;

            let currentlyTyping = this.state.currentlyTyping;

            if (parsedMessage.data.typing) {
              whoTyping = parsedMessage.data.username;
              if (!currentlyTyping.includes(whoTyping)) {
                currentlyTyping.push(whoTyping);
              } else {
                // If we 
                clearTimeout(this.typingTimeout);
              }
            }

            this.setState({
              isTyping: parsedMessage.data.typing,
              currentlyTyping,
            });


            this.typingTimeout = setTimeout(() => {
              // Remove this user from the typing list
              let index = this.state.currentlyTyping.indexOf(parsedMessage.data.username);
              if (index !== -1) {
                this.state.currentlyTyping.splice(index, 1)
              }

              this.setState({
                isTyping: this.state.currentlyTyping.length > 0,
                currentlyTyping: this.state.currentlyTyping
              });
            }, 2000);
          }

          break;
        case 'message':
          if (parsedMessage.data) {
            this.markAsDelivered(parsedMessage.data);

            let messages = this.state.messages;

            for (var i = messages.length - 1; i >= 0; i--) {
              if (parsedMessage.data.timestamp === messages[i].timestamp) {
                messages.splice(i, 1); // Remove the fake message that we don't need
                break;
              } else if (parsedMessage.data.timestamp > messages[i].timestamp) {
                break;
              }
            }

            this.pushMessages(this.state.messages.concat([parsedMessage.data]));
          }

          break
      }
    };

    this.pushMessages = this.pushMessages.bind(this);
    this.markAllAsSeen = this.markAllAsSeen.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentWillUnmount() {
    connection.close();
    clearInterval(checkOnlineInterval);
  }

  componentDidMount() {
    // if we are in a group chat, don't check for last online
    if (this.state.user) {
      // Check every 5s for new online status
      checkOnlineInterval = setInterval(() => this.getLastOnline(this.state.user._id), 5000);
    }
    document.getElementById('seen').addEventListener('click', this.markAllAsSeen);

    document.getElementById('message-list').addEventListener('scroll', (e) => {
      // console.log(e);
      e = e.srcElement;
      let offset = e.scrollTop + e.offsetHeight;
      let height = e.scrollHeight;

      if (offset !== height) {
        this.scrolled = true;
      } else {
        this.scrolled = false;
      }
    });
  }

  // Take a delivery or seen reciept and reflect it in frontend if needed
  handleReciept(parsedMessage, type) {
    for (let i = this.state.messages.length - 1; i >= 0; i--) {
      if (parsedMessage.data.messageId === this.state.messages[i]._id) {
        let updatedMessages = this.state.messages;
        updatedMessages[i][type].push(parsedMessage.data[type]);
        this.setState({messages: updatedMessages});

        break;
      }
    }
  }

  scrollToBottom() {
    if (!this.scrolled) {
      let element = document.getElementById('message-list');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }

  pushMessages(messages) {
    // console.log(messages);
    
    messages.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    this.setState({messages}, this.scrollToBottom)
  }

  sendMessage(message) {
      if (!message) {
        return;
      }
      
      this.props.sendUpdate();

      let jsonMessage = {
        token: localStorage.getItem('token'),
        text: message,
        createdAt: Date.now(),
        timestamp: Date.now(),
        deliveredTo: [],
        username: JSON.parse(localStorage.getItem('user')).username,
        room: this.room,
        forUsers: this.state.users,
        sentBy: localStorage.getItem('id'),
        fake: true, // This is when we fake the message on the frontend before delivery to the server
      }

      let messages = this.state.messages;

      messages.push(jsonMessage);

      this.pushMessages(messages);

      connection.send(JSON.stringify({
        type: 'message',
        data: jsonMessage,
      }));
  }

  getMessages(room) {
    fetch("http://" + process.env.REACT_APP_API_URL + "/messages", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token'),
      },

      body: JSON.stringify({
        room: room,
        page: 1, // TODO: Gets all messages for now  
      }),
    })
    .then( (response) => { 
       return response.json();
    }).then((json) => {
      let messages = [];
      for (let key in json) {
        if (json.hasOwnProperty(key)) {
          this.markAsDelivered(json[key])
          messages.push(json[key]);
        }
      }

      this.setState({loadingMessages: false});
      this.pushMessages(messages);
    });
  }

  markAsDelivered(message) {
    // If we haven't already marked this message as delivered to this client
    if (!message.deliveredTo.includes(localStorage.getItem('id'))) {
      fetch("http://" + process.env.REACT_APP_API_URL + "/message-delivered", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem('token'),
        },

        body: JSON.stringify({
          message: message,
          userId: localStorage.getItem('id'), // TODO: get this from JWT on the server
          token: localStorage.getItem('token'),
        })
      }).then((response) => {
        this.sendDeliveredMessage(message);
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  markAllAsSeen() {    
    for (let i = this.state.messages.length - 1; i >= 0; i--) {
      let message = this.state.messages[i];

      console.error(message.seenBy);

      // If we haven't already marked this message as delivered to this client
      if (!message.seenBy.includes(localStorage.getItem('id'))) {
        fetch("http://" + process.env.REACT_APP_API_URL + "/message-seen", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
          },

          body: JSON.stringify({
            message: message,
            userId: localStorage.getItem('id'), // TODO: get this from JWT on the server
            token: localStorage.getItem('token'),
          })
        }).then((response) => {
          this.sendSeenMessage(message);
        }).catch((err) => {
          console.error(err);
        });
      } else {
        break;
      }
    }
  }
  
  getLastOnline(userId) {
    fetch("http://" + process.env.REACT_APP_API_URL + "/last-online?id=" + userId, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token'),
      },
    })
    .then( (response) => { 
       return response.json();
    }).then((json) => {
      this.state.user.lastOnline = json.lastOnline;
      this.setState({user: this.state.user});
    });
  }

  updateTyping(typing) {  
    let jsonMessage = {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('id'),
      username: JSON.parse(localStorage.getItem('user')).username,
      timestamp: Date.now(),
      typing,
      room: this.room,
    }

    connection.send(JSON.stringify({ type: 'typing', data: jsonMessage }));
  }

  sendDeliveredMessage(message) {
    message = JSON.parse(JSON.stringify(message)); // Uuuugh js
    
    message.deliveredTo = localStorage.getItem('id');
    message.token = localStorage.getItem('token');
    message.room = this.room;
    
    connection.send(JSON.stringify({
      type: 'delivered',
      data: message,
    }));
  }

  sendSeenMessage(message) {
    message = JSON.parse(JSON.stringify(message)); // Uuuugh js
    
    message.seenBy = localStorage.getItem('id');
    message.token = localStorage.getItem('token');
    message.room = this.room;
    
    connection.send(JSON.stringify({
      type: 'seen',
      data: message,
    }));
  }

  showMenu() {
    this.setState({showMenu: true});
  }

  hideMenu() {
    this.setState({showMenu: false});
  }

  goIncognito() {
    this.setState({incognito: true, showMenu: false});
  }

  back() {
    this.setState({fadeOut: true});

    setTimeout(() => {
      this.setState({fadeOut: false});
      this.props.clearChat();
    }, 400);
  }

  render() {

    if (this.state.incognito) {
      return (
        <div>
          <Spreadsheet
            messages={this.state.messages}
            user={this.state.user}
            room={this.state.room}
            sendMessage={(msg) => this.sendMessage(msg)}
            typing={this.updateTyping}
          />
        </div>
      )
    }

    return (
      <div styleName={"container"}>
        <div styleName={"background " + (this.state.fadeOut ? 'fade' : '')}>
          <RoomHeader
            room={this.state.room}
            user={this.state.user}
            showMenu={this.showMenu}  //
            hideMenu={this.hideMenu}   //
            show={this.state.showMenu}  // bad code
            typing={this.state.isTyping}
            back={this.back}
            currentlyTyping={this.state.currentlyTyping}
          />
          <MessageList
            isGroup={typeof this.state.room !== 'undefined'}
            messages={this.state.messages}
            loading={this.state.loadingMessages}
          />
          <InputArea
            sendMessage={(msg) => this.sendMessage(msg)}
            typing={this.updateTyping}
          />
        </div>
      </div>
    );
  }
}

export default CSSModules(Chat, styles, {allowMultiple: true});

// export default connect(mapStateToProps, null)(Chat);
