import React, { Component } from 'react';
import moment from 'moment';
import Hammer from 'hammerjs';
import $ from 'jquery';

class Message extends Component {
  constructor(props) {
    super(props)

    this.state = { message: this.props.message }
    this.addSwipeListener = this.addSwipeListener.bind(this);
  }

  addSwipeListener() {
    var messageEl = document.getElementById(this.props.message.id);
    var hammer = new Hammer.Manager(messageEl);
    var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL })

    hammer.add(pan);
    hammer.on("pan", (event) => {
      messageEl.style.transition = "none";

      var angle = Math.abs(event.angle);
      if ((angle >= 0 && angle < 30) || (angle > 150 && angle <= 180)) {
        var absDelta = Math.abs(event.deltaX);
        var opacity = 1 - (absDelta / (document.body.offsetWidth / 1.35));

        messageEl.style.opacity = opacity;
        messageEl.style.transform = `translate3d(${event.deltaX}px, 0 , 0)`;
      }
    });

    hammer.on("panend", (event) => {
      if(Math.abs(event.deltaX) >= 200 || Math.abs(event.velocityX >= 1.25)) {
        messageEl.style.transform = `translate3d(${event.deltaX * 3}px, 0, 0)`;

        $(messageEl).animate({
          height: 0,
          opacity: 0
        }, 150, () => {
          this.props.removeMessage(messageEl.id);
        });
      } else {
        messageEl.style.transition = "ease-in 0.3s"
        messageEl.style.opacity = 1;
        messageEl.style.transform = `translate3d(0, 0, 0)`;
      }
    });
  }

  componentDidMount() {
    this.addSwipeListener();
  }

  render() {
    return (
      <div className="message" id={this.props.message.id}>
        <div className="meta-header">
          <img
            className="profile-image"
            src={`${this.props.baseUrl}/${this.state.message.author.photoUrl}`}
            alt={this.state.message.author.name} />
          <div className="meta">
            <div className="author-name">{this.state.message.author.name}</div>
            <div className="created-at">
              {moment(this.state.message.updated, "YYYYMMDD").fromNow()}
            </div>
          </div>
        </div>
        <div className="content">
          {this.state.message.content}
        </div>
      </div>
    );
  }
}

export default Message;
