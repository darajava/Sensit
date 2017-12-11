import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import InputArea from '../../components/InputArea/InputArea';
import MessageList from '../../components/MessageList/MessageList';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import CSSModules from 'react-css-modules';
import RoomHeader from '../../components/RoomHeader/RoomHeader';

import styles from './styles.css';

const history = createHistory();
let connection;

class Chat extends Component {
  constructor(props) {
    super(props);

    // If we don't get props (i.e. hot reload or page reload)
    // Then get them from localstorage
    if (typeof props.location.query === 'undefined') {
      props.location.query = JSON.parse(localStorage.getItem('chatInfo' + props.match.params.id));
      console.log(props.location.query);
    } else {
      // otherwise save them to localstorage
      localStorage.setItem('chatInfo' + props.match.params.id, JSON.stringify(props.location.query));
    }

    this.state = {
      messages: [],
      loadingMessages: true,
      users: props.location.query.users,
    };

    let myId = localStorage.getItem('id');

    let users = encodeURIComponent(JSON.stringify(props.location.query.users));

    this.getMessages(props.match.params.id);

    connection = new WebSocket(
      'ws://' + process.env.REACT_APP_CHAT_URL + '?room=' + props.match.params.id +
      '&users=' + users +
      '&myId=' + myId
    );

    // if user is running mozilla then use its built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    connection.onopen = () => {
      // connection is opened and ready to use
      // alert('opened');
    };

    connection.onerror = (error) => {
      // an error occurred when sending/receiving data
      // alert('error');
      console.log(error)
    };

    connection.onmessage = (message) => {
      // try to decode json (I assume that each message
      // from server is json)
      let parsedMessage = '';
      try {
        parsedMessage = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like valid JSON: ',
            message.data);
        return;
      }

      console.log(message);

      switch (parsedMessage.type) {
        case 'deliver-reciept':
          // XXX: this can definitely be made more efficient
          for (let i = 0; i < this.state.messages.length; i++) {
            if (parsedMessage.data.messageId === this.state.messages[i]._id) {
              let updatedMessages = this.state.messages;
              updatedMessages[i].deliveredTo.push(parsedMessage.data.deliveredTo);
              this.setState({messages: updatedMessages});
            }
          }

          break;
        case 'message':
          console.log(parsedMessage);

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
  }

  pushMessages(messages) {
    this.setState({messages}, () => {
      let chatBox = document.getElementById('message-list');
      chatBox.scrollTop = chatBox.scrollHeight;
    })
  }

  sendMessage(message) {
      if (!message) {
        return;
      }
      
      let jsonMessage = {
        token: localStorage.getItem('token'),
        text: message,
        timestamp: Date.now(),
        deliveredTo: [],
        forUsers: this.state.users,
        sentBy: localStorage.getItem('id'),
        fake: true, // This is when we fake the message before delivery to the server on the frontend
      }

      let messages = this.state.messages;

      messages.push(jsonMessage);

      this.pushMessages(messages);

      connection.send(JSON.stringify({ type: 'message', data: jsonMessage }));
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

  sendDeliveredMessage(message) {
    message = JSON.parse(JSON.stringify(message)); // Uuuugh js
    
    message.deliveredTo = localStorage.getItem('id');
    message.token = localStorage.getItem('token');
    
    connection.send(JSON.stringify({
      type: 'delivered',
      data: message,
    }));
  }

  render() {
    return (
      <div styleName="background">
        <RoomHeader user={this.props.location.query.roomInfo} />
        <MessageList messages={this.state.messages} loading={this.state.loadingMessages}/>
        <InputArea sendMessage={(msg) => this.sendMessage(msg)} />
      </div>
    );
  }
}

export default CSSModules(Chat, styles);

// export default connect(mapStateToProps, null)(Chat);
