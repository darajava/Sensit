import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Loading from '../../components/Loading/Loading';
import NewGroup from '../../components/NewGroup/NewGroup';
import ChatItem from '../../components/ChatItem/ChatItem';
import {Tabs, Tab} from 'material-ui/Tabs';
import HomeHeader from '../../components/HomeHeader/HomeHeader';


let tabStyle = {
  default_tab:{
    color: '#676767',
    backgroundColor: '#f1f1f1',
    fontWeight: 900,
    fontSize: 12,
  },
  active_tab:{
    color: '#676767',
    backgroundColor: '#d8edf7',
    fontWeight: 900,
    fontSize: 12,
  }
}

let connection;

class Sidebar extends Component {

  constructor() {
    super();

    // this.props = {
    //   chats: [],
    //   chatsLoaded: false,
    //   users: [],
    //   usersLoaded: false,
    //   rooms: [],
    //   roomsLoaded: false,
    //   activeIndex: 1,
    // }

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange (index) {
    this.setState({
      activeIndex: index
    });
  }

  getStyle (isActive) {
    return isActive ? tabStyle.active_tab : tabStyle.default_tab
  }

  render() {
    let chats = [];
    for (let i = 0; i < this.props.chats.length; i++) {
      chats[i] =
        <div key={i}>
          <ChatItem selectChat={this.props.selectChat} room={this.props.chats[i]} users={this.props.users} chat={true} />
        </div>;
    }

    let users = [];
    for (let i = 0; i < this.props.users.length; i++) {
      if (this.props.users[i]._id !== localStorage.getItem('id')) {
        users[i] = (
          <div key={i}>
            <ChatItem selectChat={this.props.selectChat} user={this.props.users[i]} users={this.props.users}/>
          </div>
        );
      }
    }

    let rooms = [];
    for (let i = 0; i < this.props.rooms.length; i++) {
      rooms[i] =
        <div key={i}>
          <ChatItem selectChat={this.props.selectChat} room={this.props.rooms[i]} users={this.props.users} group={true} />
        </div>;
    }

    return (
      <div styleName="container">
        <HomeHeader />

        <Tabs inkBarStyle={{ backgroundColor: '#fff'}} tabItemContainerStyle={{ height:44 }} onChange={this.handleTabChange}>
          <Tab value={1} style={ this.getStyle(this.props.activeIndex === 1) } label="Chats" >
            {(this.props.chatsLoaded && this.props.usersLoaded) ? chats : <Loading />}
          </Tab>
          <Tab value={2} style={ this.getStyle(this.props.activeIndex === 2) } label="Contacts" >
            {this.props.usersLoaded ? users : <Loading />}
          </Tab>
          <Tab value={3} style={ this.getStyle(this.props.activeIndex === 3) } label="Groups" >
            {this.props.usersLoaded && <NewGroup users={this.props.users} />}
            {(this.props.usersLoaded && this.props.roomsLoaded) ? rooms : <Loading />}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default CSSModules(Sidebar, styles);

// export default connect(mapStateToProps, null)(Chat);
