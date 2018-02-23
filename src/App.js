import React, { Component } from 'react';
import MessageList from './components/MessageList';
import './stylesheets/App.css';

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <header className="header-container">
          <i className="material-icons">menu</i>
          <span className="page-title">Messages</span>
        </header>
        <MessageList />
      </div>
    );
  }
}

export default App;
