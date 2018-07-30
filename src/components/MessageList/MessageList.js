import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Message from '../Message/Message';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import {isDelivered, isSeen, isLastSeen} from '../../messageUtils';
import EnterPin from '../EnterPin/EnterPin';
import Toast from '../Toast/Toast';
class MessageList extends React.Component {

  constructor() {
    super();

    this.state = {
      askForPin: false,
      showMessages: false,
    }
  }

  render () {
    let props = this.props; 

    let messageList = [];
    for (let i = 0; i < props.messages.length; i++) {
      if (props.messages[i]) {
        messageList.push(
          <Message
            key={i}
            message={props.messages[i]}
            isGroup={props.isGroup}
            username={props.messages[i].sentByUsername ? props.messages[i].sentByUsername : 'dunno'}
            mine={props.messages[i].sentBy === localStorage.getItem('id')}
            isDelivered={isDelivered(props.messages[i])}
            isSeen={isSeen(props.messages[i])}
            show={this.state.showMessages}
            image={props.messages[i].image}
            isLastSeen={isLastSeen(props.messages[i], props)}
            requestSensitiveMessages={(callback, cancel) => {
              this.setState({
                askForPin: true,
                callback,
                cancel,
              });
            }}
          />
        );
      }
    }

    let askForPin;
    if (this.state.askForPin) {
      askForPin = (
        <EnterPin
          onCancel={
            () => {
              this.state.callback(false, true);
              this.setState({
                askForPin: false,
              })
            }
          }
          onEnter={
            (pin) => {
              setTimeout(() => {
                props.requestSensitiveMessages(pin, (success) => {
                  if (success) {
                    this.setState({
                      showMessages: true,
                    });
                    setTimeout(() => {
                      this.setState({
                        showMessages: false,
                      });
                      props.requestSensitiveMessages();
                    }, 1000 * 10); 
                  }
                  this.state.callback(success)
                });
              }, 500);
              this.setState({
                askForPin: false,
              })
            }
          }
        />
      );
    }

    return (
      <div id="message-list" styleName="list">
        <div styleName="child">
          {messageList}
        </div>
        {askForPin}
      </div>
    )
  }
}

export default CSSModules(MessageList, styles);
 