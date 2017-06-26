import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

// components
import Home from '../components/home/home';
import ChatRoom from '../components/chat-room/chat-room';

// styles
import './app.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <nav className="app-nav bg-info navbar navbar-light">
            <a href="/" className="nav-home">Chat App</a>
          </nav>
          <Route exact path="/" component={Home}/>
          <Route path="/chat/:chatRoomId" component={ChatRoom}/>
        </div>
      </Router>
    );
  }
}

export default App;
