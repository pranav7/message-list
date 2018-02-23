import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class MessageList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: []
    }

    this.getMessages = this.getMessages.bind(this)
    this.getMessages()
  }

  getMessages() {
    axios.get("http://message-list.appspot.com/messages")
      .then(response => {
        this.setState({
          messages: response.data.messages,
          count: response.data.count
        })
      })
  }

  render() {
    return (
      <div className="messages">
        {this.state.messages.map((message) =>
          <div key={message.id}>
            <div className="message">
              <div className="meta-header">
                <img
                  className="profile-image"
                  src={`http://message-list.appspot.com/${message.author.photoUrl}`}
                  alt={message.author.name}
                ></img>
                <div className="meta">
                  <div className="author-name">{message.author.name}</div>
                  <div className="created-at">{moment(message.updated, "YYYYMMDD").fromNow()}</div>
                </div>
              </div>
              <div className="content">{message.content}</div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default MessageList;
