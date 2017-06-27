import React, { Component } from 'react';
import './message.css';

class Message extends Component {
  constructor(props) {
    super(props);
    this.fromSameUser = this.fromSameUser.bind(this);
    this.getMessageClass = this.getMessageClass.bind(this);
  }

  // helps us determine whether to display username between messages
  fromSameUser(lastMessage, thisMessage) {
    return lastMessage && lastMessage.userName === thisMessage.userName;
  }

  getMessageClass() {
    if (this.props.message.userId === this.props.thisUser.id) {
      return "align-right";
    }

    return "align-left";
  }

  render() {
    // don't show user name between messages from the same user
    if (this.fromSameUser(this.props.lastMessage, this.props.message)) {
      return (
        <div className={this.getMessageClass()}>
          <div className="message-text">{this.props.message.text}</div>
        </div>
      )
    } else {
      let previousNameStr = this.props.message.previousName ? '(Changed from ' + this.props.message.previousName + ')' : null,
          previosNameNode = (
            <span className="name-change-hint">
              {previousNameStr}
            </span>
          ),
          usernameNode = (
            this.props.message.userId === this.props.thisUser.id ?
              <div className="user-name">{previosNameNode} {this.props.message.userName}</div> :
              <div className="user-name">{this.props.message.userName} {previosNameNode}</div>
          );

      return (
        <div className={this.getMessageClass()}>
          {usernameNode}
          <div className="message-text">{this.props.message.text}</div>
        </div>
      );
    }

  }
}

export default Message;
