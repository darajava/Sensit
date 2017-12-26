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
      activeIndex: 1,
    }

    this.getRecentUsers = this.getRecentUsers.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentWillMount() {
    this.getRecentUsers();
  }

  getRecentUsers() {
    this.setState({usersLoaded: false});

    fetch("http://" + process.env.REACT_APP_API_URL + "/users", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token'),
      },
    })
    .then( (response) => { 
       return response.json();
    }).then((json) => {
      let users = [];
      for (let key in json) {
        if (json.hasOwnProperty(key)) {
          users.push(json[key]);
        }
      }

      console.log('users', users);

      this.setState({users, usersLoaded: true});
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

      console.log(this.state);
    return (
      <div>
        <HomeHeader />

        <Tabs inkBarStyle={{ backgroundColor: '#fff'}} tabItemContainerStyle={{ height:44 }} onChange={this.handleTabChange}>
          <Tab value={1} style={ this.getStyle(this.state.activeIndex === 1) } label="Chats" >
            {!this.state.usersLoaded && <Loading />}
            {this.state.usersLoaded && users}
          </Tab>
          <Tab value={2} style={ this.getStyle(this.state.activeIndex === 2) } label="Rolodex" >
            {!this.state.usersLoaded && <Loading />}
            {this.state.usersLoaded && users}
          </Tab>
          <Tab value={3} style={ this.getStyle(this.state.activeIndex === 3) } label="Calls" >
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
