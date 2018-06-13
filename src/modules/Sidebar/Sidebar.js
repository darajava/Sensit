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

class Sidebar extends Component {

  constructor() {
    super();

    this.state = {
      chats: [],
      chatsLoaded: false,
      users: [],
      usersLoaded: false,
      rooms: [],
      roomsLoaded: false,
      activeIndex: 1,
    }

    this.getRecent = this.getRecent.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentWillMount() {
    this.getRecent("chats");
    this.getRecent("users");
    this.getRecent("rooms");
  }

  getRecent(type) {
    this.setState({usersLoaded: false});

    fetch("http://" + process.env.REACT_APP_API_URL + "/" + type, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token'),
      },

      body: JSON.stringify({
        userId: localStorage.getItem('id'),
      }),
    })
    .then( (response) => { 
      console.log(response);
       return response.json();
    }).then((json) => {
      let results = [];
      for (let key in json) {
        if (json.hasOwnProperty(key)) {
          results.push(json[key]);
        }
      }

      if (type === "users") {
        this.setState({users: results, usersLoaded: true});
      } else if (type === "rooms") {
        this.setState({rooms: results, roomsLoaded: true});
      } else if (type === "chats") {
        this.setState({chats: results, chatsLoaded: true});
      }
      // // If we have this, then we should be logged in
      // localStorage.setItem('token', json.token);
    });
    // send the message as an ordinary text
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
    for (let i = 0; i < this.state.chats.length; i++) {
      chats[i] =
        <div key={i}>
          <ChatItem selectChat={this.props.selectChat} room={this.state.chats[i]} users={this.state.users} chat={true} />
        </div>;
    }

    let users = [];
    for (let i = 0; i < this.state.users.length; i++) {
      if (this.state.users[i]._id !== localStorage.getItem('id')) {
        users[i] = (
          <div key={i}>
            <ChatItem selectChat={this.props.selectChat} user={this.state.users[i]} users={this.state.users}/>
          </div>
        );
      }
    }

    let rooms = [];
    for (let i = 0; i < this.state.rooms.length; i++) {
      rooms[i] =
        <div key={i}>
          <ChatItem selectChat={this.props.selectChat} room={this.state.rooms[i]} users={this.state.users} group={true} />
        </div>;
    }

    return (
      <div styleName="container">
        <HomeHeader />

        <Tabs inkBarStyle={{ backgroundColor: '#fff'}} tabItemContainerStyle={{ height:44 }} onChange={this.handleTabChange}>
          <Tab value={1} style={ this.getStyle(this.state.activeIndex === 1) } label="Chats" >
            {(this.state.chatsLoaded && this.state.usersLoaded) ? chats : <Loading />}
          </Tab>
          <Tab value={2} style={ this.getStyle(this.state.activeIndex === 2) } label="Contacts" >
            {this.state.usersLoaded ? users : <Loading />}
          </Tab>
          <Tab value={3} style={ this.getStyle(this.state.activeIndex === 3) } label="Groups" >
            {this.state.usersLoaded && <NewGroup users={this.state.users} />}
            {(this.state.usersLoaded && this.state.roomsLoaded) ? rooms : <Loading />}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default CSSModules(Sidebar, styles);

// export default connect(mapStateToProps, null)(Chat);
