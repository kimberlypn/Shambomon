import React from 'react';

// Renders the attack history sidebar
export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: props.messages // messages to be printed in the sidebar
    }
  }

  // Returns the length of the messages array
  getLength() {
    return this.state.messages.length;
  }

  // Returns the messages in the order and format that they should be printed
  getMessages() {
    var msgs = [];
    let messages = this.state.messages;
    let len = this.getLength();
    // Make the newest set of messages be a different color
    for (var i = len - 1; i >= len - 3; i--) {
      msgs.push(<p className="last-messages">>> {messages[i]}</p>);
    }
    if (len >= 3) {
      msgs.push(<br />);
      for (var i = len - 4; i >= 0; i--) {
        msgs.push(<p>>> {messages[i]}</p>);
        // Add a space between each round
        if (i % 3 == 0) {
          msgs.push(<br />);
        }
      }
    }
    return msgs;
  }

  // Renders the messages sidebar
  render() {
    let msgs = this.getMessages();
    // Skip if no messages
    if (this.getLength() == 0) {
      return (
        <div className="col-md-3" id="messages">
          <h3>ATTACK HISTORY</h3>
        </div>
      );
    }
    else {
      return (
        <div className="col-md-3" id="messages">
          <h3>ATTACK HISTORY</h3>
          {msgs}
        </div>
      );
    }
  }
}
