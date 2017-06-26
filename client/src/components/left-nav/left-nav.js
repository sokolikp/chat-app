import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
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
    let displayNameNode;
    if (!this.state.editMode) {
      displayNameNode = (
        <div className="display-name-line" onClick={this.toggleEditMode}>
          <span className="display-name">{this.props.user ? this.props.user.name : ""}</span>
          <span className="pencil-hover"><i className="fa fa-pencil"></i></span>
        </div>
      )
    } else {
      displayNameNode = (
        <form onSubmit={this.submitUserName}>
          <input
            autoFocus
            placeholder="Display name"
            value={this.state.input}
            onBlur={this.submitUserName}
            onChange={this.updateUserName}/>
        </form>
      )
    }

    return (
      <div className="left-nav">
        <div className="display-name-container">
          <div className="display-name-header">Display name:</div>
          <div>{displayNameNode}</div>
        </div>
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

export default LeftNav;
