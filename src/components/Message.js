import React, { Component } from 'react';
import moment from 'moment';
import Hammer from 'hammerjs';

const BASE_URL = "http://message-list.appspot.com";

class Message extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: this.props.message
    }
  }

  render() {
    return (
      <div className="message" id={`message-${this.state.message.id}`}>
        <div className="meta-header">
          <img
            className="profile-image"
            src={`${BASE_URL}/${this.state.message.author.photoUrl}`}
            alt={this.state.message.author.name}
          ></img>
          <div className="meta">
            <div className="author-name">{this.state.message.author.name}</div>
            <div className="created-at">
              {moment(this.state.message.updated, "YYYYMMDD").fromNow()} | {this.state.message.id}
            </div>
          </div>
        </div>
        <div className="content">{this.state.message.content}</div>
      </div>
    );
  }
}

export default Message;
