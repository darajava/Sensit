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

  sendMessage(message) {
      if (!message) {
        return;
      }
      
      let jsonMessage = {
        token: localStorage.getItem('token'),
        text: message,
      }

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

      this.setState({messages, loadingMessages: false});
      // // If we have this, then we should be logged in
      // localStorage.setItem('token', json.token);
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

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      loadingMessages: true,
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

            this.setState({
              messages: this.state.messages.concat([parsedMessage.data])
            });
          }

          break
      }
    };
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
