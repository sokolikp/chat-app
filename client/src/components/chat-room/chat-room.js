import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Message from '../message/message';
import LeftNav from '../left-nav/left-nav';
import http from '../../utility/http';
import _ from 'lodash';
import './chat-room.css';

// only use sockets in chat rooms
import io from 'socket.io-client';

class ChatRoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null, // object or null
      previousName: null,
      input: "",
      nameError: false,
      messages: [],
      users: [],
      chatRoomId: this.props.match.params.chatRoomId,
      loaded: false,
      room: null
    };

    this.postMessage = this.postMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.checkKeyCode = this.checkKeyCode.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.addNewMessage = this.addNewMessage.bind(this);
    this.setUserName = this.setUserName.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setMessages = this.setMessages.bind(this);
    this.setUsers = this.setUsers.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.clearError = this.clearError.bind(this);
  }

  componentDidMount () {
    // get room data
    http.get('/api/room/chat_room', {chatRoomId: this.props.match.params.chatRoomId})
      .then(response => {
        let room = response.room || null;
        // update state
        this.setState({
          room: room,
          loaded: true
        });

        if (room === null) { return; }

        // connect user to socket when we confirm this is a valid room
        const socket = io();
        socket.on("connect", () => {
          socket.emit('join_room', this.state.chatRoomId);

          socket.on('room_data', data => {
            this.setUser(data.user);
            this.setMessages(data.messages);
            this.setUsers(data.users);
          });

          socket.on('new_message', data => {
            this.addNewMessage(data.message);
          });

          socket.on('new_user', data => {
            this.addNewUser(data.user);
          });

          socket.on('update_user', data => {
            this.updateUser(data.user);
          });

          socket.on('user_left', data => {
            this.removeUser(data.userId);
          });
        });
      })
      .catch(error => {
        console.warn("Could not get chat room data", error);
      });

  }

  componentDidUpdate() {
    if (this.state.loaded && this.state.messages.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom () {
    let node = ReactDOM.findDOMNode(this.messagesEnd);
    node.scrollIntoView({ behavior: "smooth" });
  }

  addNewMessage (message) {
    if (message.userName === this.state.user.name) { return; }

    let messages = this.state.messages;
    messages.push(message);
    this.setState({
      messages: messages
    });
  }

  addNewUser (user) {
    if (user.id === this.state.user.id) { return; }

    let users = this.state.users;
    users.push(user);
    this.setState({
      users: users
    });
  }

  updateUser (updateUser) {
    if (updateUser.id === this.state.user.id) { return; }

    let users = this.state.users,
        updateIdx = _.findIndex(users, (user) => {
          return user.id === updateUser.id;
        });

    users[updateIdx] = updateUser;
    this.setState({
      users: users
    });
  }

  removeUser (userId) {
    let users = this.state.users;
    _.remove(users, (user) => {
      return user.id === userId;
    });

    this.setState({
      users: users
    });
  }

  setUser (user) {
    if (this.state.user === null) {
      this.setState({
        user: user
      });
    }
  }

  setMessages (messages) {
    if (this.state.messages.length === 0) {
      this.setState({
        messages: messages
      });
    }
  }

  setUsers (users) {
    if (this.state.users.length === 0) {
      this.setState({
        users: users
      });
    }
  }

  setUserName (nameStr) {
    // change user's name on backend
    http.put('/api/user/user', {
      id: this.state.user.id,
      name: nameStr,
      roomId: this.state.chatRoomId
    })
    .then((payload) => {
      if (payload.error && payload.error === 'invalid_name') {
        this.setState({
          nameError: true
        });
        setTimeout(() => {
          this.clearError();
        }, 3000);
      } else {
        let previousName = this.state.previousUserName !== null ? this.state.previousUserName : this.state.user.name,
            user = this.state.user;

        user.name = nameStr;
        this.setState({
          previousUserName: previousName,
          user: user
        });
      }
    });
  }

  clearError () {
    this.setState({
      nameError: false
    });
  }

  updateMessage (event) {
    this.setState({input: event.target.value});
  }

  checkKeyCode (event) {
    // handle enter for submit
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      this.postMessage();
    }
  }

  postMessage () {
    if (!this.state.input) { return; }

    let message = {
      userId: this.state.user.id,
      userName: this.state.user.name,
      chatRoomId: this.state.chatRoomId,
      text: this.state.input,
      previousName: this.state.previousUserName
    }

    http.post('/api/message/message', message);
    this.state.messages.push(message);

    this.setState({
      input: "",
      previousUserName: null
    });

  }

  render() {

    // // wait for load
    if (!this.state.loaded) {
      return <div className="spinner"><i className="fa fa-spinner fa-spin"></i></div>;
    }

    // room doesn't exist yet - error state
    if (this.state.loaded && this.state.room === null) {
      return (
        <div className="room-error">
          Woops! It looks like this room doesn't exist.<br/>
          You can create one from the <span><a href="/">home</a></span> page.
        </div>
      )
    }

    const messages = this.state.messages.map((message, index) => {
      let lastMessage = index > 0 ? this.state.messages[index - 1] : null;
      return (
        <Message
          thisUser={this.state.user}
          message={message}
          lastMessage={lastMessage}
          key={index}>
        </Message>
      )
    });

    return (
      <div className="chat-room">
        <LeftNav
          user={this.state.user}
          users={this.state.users}
          setUserName={this.setUserName}
          nameError={this.state.nameError}>
        </LeftNav>

        <form className="chat-form" onSubmit={this.postMessage}>
          <div className="chat-history">
            {messages}
            <div ref={(el) => { this.messagesEnd = el; }}></div>
          </div>

          <textarea
            autoFocus
            rows="4"
            type="submit"
            placeholder="Write something..."
            value={this.state.input}
            onChange={this.updateMessage}
            onKeyDown={this.checkKeyCode}>
          </textarea>
          <button type="button" className="btn btn-info" onClick={this.postMessage}>Post</button>
        </form>
        <div className="right-nav"></div>
      </div>
    );
  }
}

export default ChatRoom;
