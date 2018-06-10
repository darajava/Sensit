import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Loading from '../../components/Loading/Loading';
import ChatItem from '../../components/ChatItem/ChatItem';
import {Tabs, Tab} from 'material-ui/Tabs';
import HomeHeader from '../../components/HomeHeader/HomeHeader';


let tabStyle = {
  default_tab:{
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: '#00BDBE',
    fontWeight: 900,
    fontSize: 12,
  },
  active_tab:{
    color: '#fff',
    backgroundColor: '#00BDBE',
    fontWeight: 900,
    fontSize: 12,
  }
}

class Home extends Component {

  constructor() {
    super();

    this.state = {
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
    this.getRecent("users");
    this.getRecent("rooms");
  }

  // Todo: This doesn't yet get them in order of last message delivered
  // fox on server
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
          if (json[key]._id !== localStorage.getItem('id')) {
            results.push(json[key]);            
          }
        }
      }

      if (type === "users") {
        this.setState({users: results, usersLoaded: true});
      } else if (type === "rooms") {
        this.setState({rooms: results, roomsLoaded: true});
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
    let users = [];
    for (let i = 0; i < this.state.users.length; i++) {
      users[i] =
        <div key={i}>
          <ChatItem user={this.state.users[i]} />
        </div>;
    }


    let rooms = [];
    for (let i = 0; i < this.state.rooms.length; i++) {
      rooms[i] =
        <div key={i}>
          <ChatItem room={this.state.rooms[i]} />
        </div>;
    }

    return (
      <div>
        <HomeHeader />

        <Tabs inkBarStyle={{ backgroundColor: '#fff'}} tabItemContainerStyle={{ height:44 }} onChange={this.handleTabChange}>
          <Tab value={1} style={ this.getStyle(this.state.activeIndex === 1) } label="Chats" >
            {!this.state.usersLoaded && <Loading />}
            {this.state.usersLoaded && users}
          </Tab>
          <Tab value={2} style={ this.getStyle(this.state.activeIndex === 2) } label="Contacts" >
            {!this.state.roomsLoaded && <Loading />}
            {this.state.roomsLoaded && rooms}
          </Tab>
          <Tab value={3} style={ this.getStyle(this.state.activeIndex === 3) } label="Groups" >
            {!this.state.usersLoaded && <Loading />}
            {this.state.usersLoaded && users}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default CSSModules(Home, styles);

// export default connect(mapStateToProps, null)(Chat);
