import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function start_game(root, channel) {
  ReactDOM.render(<Shambomon channel={channel}/>, root);
}

class Shambomon extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      availableCharacters: [],
    };

    this.channel.join()
    .receive('ok', this.gotView.bind(this))
    .receive('error', res => {
      console.log('Unable to join', res);
    });
  }

  gotView(view) {
    this.setState(view.game);
  }

  // Renders the battlefield
  render() {
    return(
      <div>
      </div>
    );
  }
}
