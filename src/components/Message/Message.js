import React from 'react';
import moment from 'moment'

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Loading from '../Loading/Loading';
import Toast from '../Toast/Toast';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import { decode } from '../../utils/utils';


function changeColor(col, amt) {
  
    var useHash = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        useHash = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (useHash ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  
}

let stringToColor = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var color = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

class Message extends React.Component {

  constructor() {
    super();

    this.state = {
      show: false,
      spinner: false,
    }
  }

  showMessage = () => {
    if (!this.props.message.sensitive) {
      return;
    }

    this.setState({
      spinner: true,
    })
    this.props.requestSensitiveMessages((success, cancel) => {
      this.setState({
        show: success,
        toast: null,
        spinner: false,
      }, () => {
        if (success) {
          this.setState({
            toast: <Toast message="Sensitive messages decrypted for 10 minutes" />,
          });
        } else if (!success && !cancel) {
          this.setState({
            toast: <Toast message="Incorrect PIN" />,
          });
        }

      })
    });
  }

  render() {

    let props = this.props;
    let delivered = <span styleName="sent-icon"><Glyphicon glyph="ok" /></span>;
    
    if (props.isLastSeen) {
      delivered = (
        <span styleName="seen-image">
          <img src={
            props.user && props.user.image
              ? props.user.image
              : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' }
              />
        </span>
      );
    } else if (props.isSeen) {
      let fadeStyle = styles["seen-image"] + " " + styles["fade-out"];
      delivered = (
        <span className={fadeStyle}>
          <img src={
            props.user && props.user.image
              ? props.user.image
              : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' }
              />
        </span>
      );
    } else if (props.isDelivered) {
      delivered = <span styleName="delivered-icon"><Glyphicon glyph="ok" /></span>;
    } else if (props.message.fake) {
      delivered = <span styleName="pending-icon"><Glyphicon glyph="time" /></span>
    }

    let bang = '';

    if (props.message.text.length < 50 && props.message.text.indexOf('!') > -1) {
      if (props.message.text.indexOf('!!') > -1) {
        bang = 'louder';
      } else {
        bang = 'loud';
      }
    }

    let username = '';

    if (props.isGroup && !props.mine) {
      let nameColor = stringToColor(props.username);
      username = (
        <div>
          <div styleName="username-hint" style={{color: nameColor, borderBottom: "1px solid " + changeColor(nameColor, 190)}}>
            {props.username}
          </div>
        </div>
      );
    }

    let sensitiveBlur = !this.props.show && props.message.sensitive ? 'sensitive-blur' : '';
    let sensitiveClass = props.message.sensitive ? 'sensitive' : '';

    let spinner = this.state.spinner ? <div styleName="loader-holder"> <Loading message={true}/></div> : null;

    let messageContent = decode(props.message.text);
    if (typeof props.message.image !== 'undefined') {
      messageContent = <img src={props.message.image} />;
    }

    return (
      <div styleName={`message-holder`}>
        {this.state.toast}

        <div styleName={sensitiveClass + (props.mine ? ' my-message' : ' your-message')} onClick={this.showMessage}>
          {spinner}
          {username}
          <div styleName={'message-text ' + bang + ' ' + sensitiveBlur}>
            {messageContent}
          </div>
          <span styleName="info">
            <div styleName="time">
              {moment(props.message.createdAt).format('h:mm a')}
            </div>
            {props.mine && 
              <div styleName="delivered">
                {delivered}
              </div>
            }
          </span>
        </div>
      </div>
    );
  }
}

export default CSSModules(Message, styles, {allowMultiple: true});
 