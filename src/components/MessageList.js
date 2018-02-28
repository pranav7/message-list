import React, { Component } from 'react';
import Message from './Message';
import $ from 'jquery';

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      isFetching: false
    };

    this.baseUrl = 'https://message-list.appspot.com'
    this.getMessages = this.getMessages.bind(this);
    this.getMoreMessages = this.getMoreMessages.bind(this);
    this.appendMessages = this.appendMessages.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.loadingEl = this.loadingEl.bind(this);
    this.noNetworkEl = this.noNetworkEl.bind(this);
    this.init = this.init.bind(this);
    this.init()
  }

  init() {
    this.getMessages((response) => {
      this.setState({
        messages: response.messages,
        pageToken: response.pageToken
      });
    });
  }

  getMoreMessages() {
    this.setState({ isFetching: true })

    this.getMessages((response) => {
      this.setState({
        isFetching: false,
        pageToken: response.pageToken
      })
      this.appendMessages(response.messages)
    }, { pageToken: this.state.pageToken });
  }

  getMessages(success, options = {}) {
    $.get(this.baseUrl + "/messages", options)
      .done((data) => {
        success(data)
      })
      .fail((data) => {
        this.setState({ noNetwork: true });
      })
  }

  appendMessages(messages) {
    var existingMessages = this.state.messages;
    this.setState({
      messages: existingMessages.concat(messages)
    });
  }

  removeMessage(id) {
    var messages = this.state.messages.filter((message) => {
      return message.id != id;
    });

    this.setState({ messages: messages });
    if (this.state.messages.length === 0) {
      this.getMoreMessages();
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll() {
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

  noNetworkEl() {
    if (this.state.noNetwork) {
      return (
        <div className="no-network">
          No Internet Connection
        </div>
      )
    }
  }

  render() {
    return (
      <div className="messages">
        {this.state.messages.map((message) =>
          <React.Fragment key={message.id}>
            <Message message={message}
              removeMessage={this.removeMessage.bind(this)}
              baseUrl={this.baseUrl} />
          </React.Fragment>
        )}
        {this.loadingEl()}
        {this.noNetworkEl()}
      </div>
    );
  }
}

export default MessageList;
