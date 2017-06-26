import React, { Component } from 'react';
import http from '../../utility/http';
import './home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    }

    this.startNewChat = this.startNewChat.bind(this);
    this.updateRoomName = this.updateRoomName.bind(this);
  }

  updateRoomName (event) {
    this.setState({input: event.target.value});
  }

  startNewChat(event) {
    event.preventDefault();
    let params = this.state.input !== "" ? {roomId: this.state.input} : {};
    http.post('/api/room/chat_room', params)
      .then(response => {
        let room = response.room;
        this.props.history.push('/chat/' + room.chatRoomId);
      })
      .catch(error => {
        console.warn("could not create a new room.", error);
      });
  }

  render() {
    return (
      <div className="home">
        <form onSubmit={this.startNewChat}>
          <div className="margin-bottom-10">
            <input
              autoFocus
              placeholder="Room name..."
              value={this.state.input}
              onChange={this.updateRoomName}/>
          </div>
          <div className="margin-bottom-10">
            <button type="button" className="btn btn-info" onClick={this.startNewChat}>
              Create a new chat
            </button>
          </div>
          <div className="hint-text">
            Click to create a new chat room.<br/>
            You can optionally enter a custom room name.
          </div>
        </form>
      </div>
    );
  }
}

export default Home;
