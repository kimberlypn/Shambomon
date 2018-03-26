import React from 'react';

// Renders the attack history sidebar
export default function Messages(props) {
  let messages = props.state.messages;
  // Skip if no messages
  if (messages.length == 0) {
    return (
      <div className="col-md-3" id="messages">
        <h3>ATTACK HISTORY</h3>
      </div>
    );
  }
  else {
    var msgs = [];
    // Make the newest set of messages a different color
    for (var i = messages.length - 1; i >= messages.length - 3; i--) {
      msgs.push(<p className="last-messages">>> {messages[i]}</p>);
    }
    if (messages.length >= 3) {
      msgs.push(<br />);
      for (var i = messages.length - 4; i >= 0; i--) {
        msgs.push(<p>>> {messages[i]}</p>);
        // Add a space between each round
        if (i % 3 == 0) {
          msgs.push(<br />);
        }
      }
    }

    return (
      <div className="col-md-3" id="messages">
        <h3>ATTACK HISTORY</h3>
        {msgs}
      </div>
    );
  }
}