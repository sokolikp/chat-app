import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';
import "./left-nav.css";

class LeftNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      editMode: false,
      copied: false
    };

    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.updateUserName = this.updateUserName.bind(this);
    this.submitUserName = this.submitUserName.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  toggleEditMode() {
    let currentState = this.state.editMode,
        currentName;

    if (this.state.editMode) {
      currentName = this.state.input;
    } else if (this.props.user) {
      currentName = this.props.user.name;
    }

    this.setState({
      editMode: !currentState,
      input: currentName
    });
  }

  copyToClipboard (event) {
    this.setState({
      copied: true
    });

    let context = this;
    setTimeout(() => {
      context.setState({
        copied: false
      });
    }, 2000);
  }

  updateUserName (event) {
    this.setState({input: event.target.value});
  }

  submitUserName (event) {
    event.preventDefault();
    if (this.state.input !== "" && this.state.input !== this.props.user.name) {
      this.props.setUserName(this.state.input);
    }
    this.toggleEditMode();
  }

  render() {
    return (
      <div className="left-nav">
        <div className="display-name-container">
          <div className="display-name-header">Display name:</div>
          <div>{DisplayName(this)}</div>
        </div>
        <div>{UserList(this.props.users, this.props.user)}</div>
        <div className="hint">
          You can copy and share this link. Anyone who has the link can post here.<br/>
          <CopyToClipboard
            text={window.location.href}
            onCopy={this.copyToClipboard}>
            <a className="clickable">Copy to clipboard</a>
          </CopyToClipboard>
          <span className="copy-text">{this.state.copied ? 'Copied!' : null}</span>
        </div>
      </div>
    )

  }
}

/***** abstract some render function logic; not necessary to break into separate component ******/
const DisplayName = (context) => {
  if (!context.state.editMode) {
    return (
      <div className="display-name-line" onClick={context.toggleEditMode}>
        <span className="display-name">{context.props.user ? context.props.user.name : ""}</span>
        <span className="pencil-hover"><i className="fa fa-pencil"></i></span>
        <span className="name-error">{context.props.nameError ? "That name already exists!" : ""}</span>
      </div>
    )
  } else {
    return (
      <form onSubmit={context.submitUserName}>
        <input
          autoFocus
          placeholder="Display name"
          value={context.state.input}
          onBlur={context.submitUserName}
          onChange={context.updateUserName}/>
      </form>
    )
  }
};

const UserList = (users, thisUser) => {
  if (!thisUser) { return; }

  let userList = [];
  userList.push(
    <div key={thisUser.id} className="user-list__user">
      <div className="bullet-container">
        <div className="active-bullet"></div>
      </div>
      <div>{thisUser.name} <span>(You)</span></div>
    </div>
  );

  _.each(users, (user) => {
    if (user.id !== thisUser.id) {
      userList.push(
        <div key={user.id} className="user-list__user">
          <div className="bullet-container">
            <div className="active-bullet"></div>
          </div>
          <div>{user.name}</div>
        </div>
      );
    }
  });

  return (
    <div className="user-list">
      <div className="user-list-title">Users Here:</div>
      {userList}
    </div>
  )
};

export default LeftNav;
