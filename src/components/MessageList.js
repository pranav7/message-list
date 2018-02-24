import React, { Component } from 'react';
import Message from './Message';
import axios from 'axios';

const BASE_URL = "https://message-list.appspot.com";

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      isFetching: false
    };

    this.getMessages = this.getMessages.bind(this);
    this.getMoreMessages = this.getMoreMessages.bind(this);
    this.appendMessages = this.appendMessages.bind(this);
    this.loadingEl = this.loadingEl.bind(this);
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

  removeMessage(id) {
    console.log("Delete " + id)
    var messages = this.state.messages.filter((message) => {
      return message.id != id;
    });

    setTimeout(() => {
      this.setState({ messages: messages });
    }, 250);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false)
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
    this.state.messages.length &&
    !this.state.isFetching) {
      this.getMoreMessages();
    }
  }

  loadingEl() {
    if (this.state.isFetching === true) {
      return (
        <div className="loading-el">
          <i className="material-icons spin">cached</i>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="messages">
        {this.state.messages.map((message) =>
          <React.Fragment key={message.id}>
            <Message message={message} removeMessage={this.removeMessage.bind(this)}/>
          </React.Fragment>
        )}
        {this.loadingEl()}
      </div>
    );
  }
}

export default MessageList;
