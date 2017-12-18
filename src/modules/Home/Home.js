import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Loading from '../../components/Loading/Loading';
import ChatItem from '../../components/ChatItem/ChatItem';

class Home extends Component {

  constructor() {
    super();

    this.state = {
      users: [],
      usersLoaded: false,
    }

    this.getRecentUsers = this.getRecentUsers.bind(this);
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

  render() {

    let users = [];
    for (let i = 0; i < this.state.users.length; i++) {
      console.log('lusers', this.state.users[i])
      users[i] =
        <div key={i}>
          <ChatItem user={this.state.users[i]} />
        </div>;
    }

    return (
      <div>
        {!this.state.usersLoaded && <Loading />}
        {this.state.usersLoaded && users}
      </div>
    );
  }
}

export default CSSModules(Home, styles);

// export default connect(mapStateToProps, null)(Chat);
