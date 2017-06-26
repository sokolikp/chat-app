import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Message from '../message/message';
import LeftNav from '../left-nav/left-nav';
import http from '../../utility/http';
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
      messages: [],
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
    this.setDefaultUserName = this.setDefaultUserName.bind(this);
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

          socket.on('new_message', data => {
            this.addNewMessage(data.message);
          });

          socket.on('room_size', data => {
            this.setDefaultUserName(data.size);
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

    message.isCurrentUser = false;
    let messages = this.state.messages;
    messages.push(message);
    this.setState({
      messages: messages
    });
  }

  setDefaultUserName (roomSize) {
    if (this.state.user === null) {
      let roomId = this.state.chatRoomId;
      this.setState({
        user: { name: 'anon ' + (roomSize + 1), chatRoomId: roomId }
      });
    }
  }

  setUserName (nameStr) {
    let previousName = this.state.previousUserName !== null ? this.state.previousUserName : this.state.user.name,
        roomId = this.state.chatRoomId,
        user = { name: nameStr, chatRoomId: roomId };
    this.setState({
      previousUserName: previousName,
      user: user
    });

    // if a user is explicitly setting their username, POST to backend
    http.post('/api/user/user', user);
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
      isCurrentUser: true,
      userName: this.state.user.name,
      text: this.state.input,
      chatRoomId: this.state.chatRoomId,
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
        <LeftNav user={this.state.user} setUserName={this.setUserName}></LeftNav>

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
