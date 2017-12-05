import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import InputArea from '../../components/InputArea/InputArea';
import MessageList from '../../components/MessageList/MessageList';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import CSSModules from 'react-css-modules';
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

      console.log('sending')

      connection.send(JSON.stringify(jsonMessage));
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
          messages.push(json[key]);
        }
      }

      console.log(messages);

      this.setState({messages, loadingMessages: false});
      // // If we have this, then we should be logged in
      // localStorage.setItem('token', json.token);
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      loadingMessages: true,
    };

    console.log(props);

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
      let json = '';
      console.log('message');
      console.log(message);
      try {
        json = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like valid JSON: ',
            message.data);
        return;
      }

      // If the incoming message isn't ours, then mark it as delivered to them
      if (json.data.sentBy !== localStorage.getItem('id')) {
        fetch("http://" + process.env.REACT_APP_API_URL + "/message-delivered", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
          },

          body: JSON.stringify({
            message: json.data,
            userId: localStorage.getItem('id'), // TODO: get this from JWT on the server  
          }),
        });
      }

      if (json.data.text) {
        this.setState({
          messages: this.state.messages.concat([json.data])
        });
      }
    };
  }

  render() {
    return (
      <div styleName="background">
        <MessageList messages={this.state.messages} loading={this.state.loadingMessages}/>
        <InputArea sendMessage={(msg) => this.sendMessage(msg)} />
      </div>
    );
  }
}

export default CSSModules(Chat, styles);

// export default connect(mapStateToProps, null)(Chat);
