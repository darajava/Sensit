import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import InputArea from '../../components/InputArea/InputArea';
import MessageList from '../../components/MessageList/MessageList';
import Spreadsheet from '../../components/Spreadsheet/Spreadsheet';
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

    this.typingTimeout = null;

    this.updateTyping = this.updateTyping.bind(this);
    this.handleReciept = this.handleReciept.bind(this);
  }


  componentWillMount() {
    let props = this.props;
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
      user: props.location.query.user,
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
          this.handleReciept(parsedMessage, 'deliveredTo');

          break;

        case 'seen-reciept':
          this.handleReciept(parsedMessage, 'seenBy');

          break;
        case 'typing':
          console.log(parsedMessage);

          if (parsedMessage.data) {
            this.setState({isTyping: parsedMessage.data.typing});

            clearTimeout(this.typingTimeout);

            this.typingTimeout = setTimeout(() => this.setState({isTyping: false}), 2000);
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
    this.markAllAsSeen = this.markAllAsSeen.bind(this);
  }

  componentDidMount() {
    setInterval(() => this.getLastOnline(this.state.user._id), 5000); // Check every 5s for new online status;
    document.getElementById('seen').addEventListener('click', this.markAllAsSeen);
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

  pushMessages(messages) {
    // console.log(messages);
    
    messages.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

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
        createdAt: Date.now(),
        timestamp: Date.now(),
        deliveredTo: [],
        forUsers: this.state.users,
        sentBy: localStorage.getItem('id'),
        fake: true, // This is when we fake the message on the frontend before delivery to the server
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
      console.log('xxx', json);
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
      this.setState(this.state.user);
      console.log('user roomheader', json);
      json.lastOnline;
    });
  }

  updateTyping(typing) {  
      let jsonMessage = {
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('id'),
        timestamp: Date.now(),
        typing,
      }

      connection.send(JSON.stringify({ type: 'typing', data: jsonMessage }));
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

  sendSeenMessage(message) {
    message = JSON.parse(JSON.stringify(message)); // Uuuugh js
    
    message.seenBy = localStorage.getItem('id');
    message.token = localStorage.getItem('token');
    
    connection.send(JSON.stringify({
      type: 'seen',
      data: message,
    }));
  }

  render() {

    let disguise = false;

    if (disguise) {
      return (
        <div>
          <Spreadsheet
            messages={this.state.messages}
            user={this.state.user}
            sendMessage={(msg) => this.sendMessage(msg)}
            typing={this.updateTyping}
          />
        </div>
      )
    }

    return (
      <div styleName="background">
        <RoomHeader user={this.state.user} typing={this.state.isTyping} />
        <MessageList messages={this.state.messages} loading={this.state.loadingMessages}/>
        <InputArea sendMessage={(msg) => this.sendMessage(msg)} typing={this.updateTyping} />
      </div>
    );
  }
}

export default CSSModules(Chat, styles);

// export default connect(mapStateToProps, null)(Chat);
