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


class Home extends Component {

  constructor() {
    super();
    this.state = {
      chat: null,
    };

    this.selectChat = this.selectChat.bind(this);
  }

  componentWillMount() {
    
  }

  selectChat(roomId, users, user, room) {
    console.log('bobobo', arguments )
    this.setState({chat: null}, () =>
      this.setState({chat: <Chat roomId={roomId} users={users} user={user} room={room} />})
    );
  }

  render() {
    
    return (
      <div>
        <Sidebar selectChat={this.selectChat} />
        { this.state.chat }
      </div>
    );
  }
}

export default CSSModules(Home, styles);

// export default connect(mapStateToProps, null)(Chat);
