import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

// components
import Home from '../components/home/home';
import ChatRoom from '../components/chat-room/chat-room';

// styles
import './app.css'

class App extends Component {
  render() {
    return (
      <div className="app">
        <nav className="app-nav bg-info navbar navbar-light">
          <a href="/" className="nav-home">Chat App</a>
        </nav>
        <Router>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/chat/:chatRoomId" component={ChatRoom}/>
            <Route path="*" component={fourOhFour}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

const fourOhFour = () => {
  return (
    <div className="fourOhFour">Uh oh! It looks like that page doesn't exist. Go <Link to="/">home</Link>.</div>
  );
}

export default App;
