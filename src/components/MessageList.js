import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

const BASE_URL = "http://message-list.appspot.com";

class MessageList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
      isFetching: false
    };

    this.getMessages = this.getMessages.bind(this)
    this.getMoreMessages = this.getMoreMessages.bind(this)
    this.appendMessages = this.appendMessages.bind(this)
    this.getMessages()
  }

  getMessages() {
    axios.get(BASE_URL + "/messages")
      .then(response => {
        this.setState({
          messages: response.data.messages,
          pageToken: response.data.pageToken
        })
      })
  }

  getMoreMessages() {
    this.setState({ isFetching: true })
    axios.get(BASE_URL + `/messages?pageToken=${this.state.pageToken}`)
      .then(response => {
        this.setState({
          isFetching: false,
          pageToken: response.data.pageToken
        })
        this.appendMessages(response.data.messages)
      })
  }

  appendMessages(messages) {
    var existingMessages = this.state.messages
    this.setState({
      messages: existingMessages.concat(messages)
    })
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false)
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && this.state.messages.length && !this.state.isFetching) {
      this.getMoreMessages();
    }
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
                  <div className="created-at">{moment(message.updated, "YYYYMMDD").fromNow()} | {message.id}</div>
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
