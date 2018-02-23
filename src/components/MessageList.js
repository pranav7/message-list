import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

const BASE_URL = "http://message-list.appspot.com";

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };

    this.getMessages = this.getMessages.bind(this);
    this.getMessages();
  }

  getMessages() {
    axios.get(BASE_URL + "/messages")
      .then(response => {
        this.setState({
          messages: response.data.messages,
          count: response.data.count
        });
      })
  }

  render() {
    return (
      <div className="messages">
        {this.state.messages.map((message) =>
          <React.Fragment key={message.id}>
            <div className="message">
              <div className="meta-header">
                <img
                  className="profile-image"
                  src={`${BASE_URL}/${message.author.photoUrl}`}
                  alt={message.author.name}
                ></img>
                <div className="meta">
                  <div className="author-name">{message.author.name}</div>
                  <div className="created-at">{moment(message.updated, "YYYYMMDD").fromNow()}</div>
                </div>
              </div>
              <div className="content">{message.content}</div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default MessageList;
