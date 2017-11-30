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

const connection = new WebSocket('ws://127.0.0.1:1337');


class Chat extends Component {

  sendMessage(message) {
      if (!message) {
        return;
      }
      // send the message as an ordinary text
      connection.send(message);
  }

  constructor() {
    super();

    this.state = {
      messages: [],
    };

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;


    connection.onopen = () => {
      // connection is opened and ready to use
      alert('opened');
    };

    connection.onerror = (error) => {
      // an error occurred when sending/receiving data
      alert('error');
    };

    connection.onmessage = (message) => {
      // try to decode json (I assume that each message
      // from server is json)
      let json = '';

      try {
        json = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like valid JSON: ',
            message.data);
        return;
      }

      if (json.data.text) {
        this.setState({
          messages: this.state.messages.concat([json])
        });
      }
    };
  }

  render() {
    return (
      <div styleName="background">
        <MessageList messages={this.state.messages}/>
        <InputArea sendMessage={(msg) => this.sendMessage(msg)} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sessionData: state.getIn(['loginState', 'sessionData']),
  }
}

export default CSSModules(Chat, styles);

// export default connect(mapStateToProps, null)(Chat);
