import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
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

    this.state = {
      activeIndex: 1,
    }

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


  getCorrectUser(userId, users) {
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id === userId) {
        return users[i];
      }
    }
  }

  // Move this up if need to use globally
  applyTouchStyles() {
    let button = document.querySelectorAll('.touchh');
    for (let i = 0; i < button.length; i++) {
      let listener = function(e) {

        e.offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft;     
        e.offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop;



        let effect = document.createElement('div');

        effect.className = 'effect';
        effect.style.top = e.offsetY + 'px';
        effect.style.left = e.offsetX + 'px';
        e.srcElement.prepend(effect);
        setTimeout(() => {
          // e.srcElement.removeChild(effect);
        }, 1100);
      }

      // button[i].onclick = listener;
      button[i].ontouchstart = listener;

    }
  }

  componentDidMount() {
    this.applyTouchStyles();
  }

  componentDidUpdate() {
    this.applyTouchStyles();
  }

  render() {
    let chats = [];
    for (let i = 0; i < this.props.chats.length; i++) {
      let user;
      let chat = this.props.chats[i];

      if (chat.autogenerated) {
        for (let j = 0; j < chat.users.length; j++) {
          if (chat.users[j] !== localStorage.getItem('id')) {
            user = this.getCorrectUser(chat.users[j], this.props.users);
          }
        } 
      }

      console.log(user);
      chats[i] = (
        <div key={i}>
          <ChatItem 
            selectChat={this.props.selectChat}
            users={this.props.users}
            chat={true}
            user={user}
            room={this.props.chats[i]}
          />
        </div>
      );
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
            <Tab value={1} style={ this.getStyle(this.state.activeIndex === 1) } label="Chats" >
              {chats}
            </Tab>
            <Tab value={2} style={ this.getStyle(this.state.activeIndex === 2) } label="Contacts" >
              {this.props.usersLoaded ? <div styleName="chat-group">{users}</div> : <div />}
            </Tab>
            <Tab value={3} style={ this.getStyle(this.state.activeIndex === 3) } label="Groups" >
              {this.props.usersLoaded && <NewGroup users={this.props.users} />}
              {(this.props.usersLoaded && this.props.roomsLoaded) ? <div styleName="chat-group">{rooms}</div> : <div />}
            </Tab>
          </Tabs>
      </div>
    );
  }
}


            // {this.props.usersLoaded ? <div styleName="chat-group">{users}</div> : <Loading />}

        /**/

export default CSSModules(Sidebar, styles);

// export default connect(mapStateToProps, null)(Chat);
