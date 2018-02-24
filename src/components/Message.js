import React, { Component } from 'react';
import moment from 'moment';
import Hammer from 'hammerjs';

const BASE_URL = "http://message-list.appspot.com";

class Message extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: this.props.message,
      componentId: this.props.message.id
    }

    this.addSwipeListener = this.addSwipeListener.bind(this);
  }

  addSwipeListener() {
    var messageEl = document.getElementById(this.state.componentId);
    console.log("Add Event Listener for " + messageEl.id);

    var hammer = new Hammer.Manager(messageEl);
    var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL })
    hammer.add(pan);

    var deltaX;
    hammer.on("panleft panright", (event) => {
      deltaX = event.deltaX;
      messageEl.style.transform = `translate3d(${event.deltaX + 100}px, 0, 0)`;
    });

    messageEl.addEventListener("touchend", (e) => {
      if(deltaX > 200 || deltaX < -200) {
        this.props.removeMessage(messageEl.id);
      } else {
        messageEl.style.transform = `translate3d(0, 0, 0)`;
      }
    }, false);
  }

  componentDidMount() {
    this.addSwipeListener();
  }

  render() {
    return (
      <div className="message" id={this.state.componentId}>
        <div className="meta-header" id={this.state.componentId}>
          <img
            className="profile-image"
            src={`${BASE_URL}/${this.state.message.author.photoUrl}`}
            alt={this.state.message.author.name}
          ></img>
          <div className="meta">
            <div className="author-name">{this.state.message.author.name}</div>
            <div className="created-at">
              {moment(this.state.message.updated, "YYYYMMDD").fromNow()}
            </div>
          </div>
        </div>
        <div className="content" id={this.state.componentId}>
          {this.state.message.content}
        </div>
      </div>
    );
  }
}

export default Message;
