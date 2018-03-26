import React from 'react';

import NewGame from './new-game';
import Leaderboard from './leaderboard';
import Limbo from './limbo';

export default class Winner extends React.Component {
  constructor(props) {
    super(props);
    this.reset = props.reset; // reset function
    this.state = {
      winner: props.winner, // id of the winner
      id: props.id, // id of the caller
      spectators: props.spectators // list of spectators
    }
  }

  // Returns the end-game message corresponding to the user's status
  getMessage() {
    if (this.state.winner == this.state.id) {
      return "You won!";
    }
    else {
      return "You lost!";
    }
  }

  render() {
    if (!this.state.spectators.includes(this.state.id)) {
      return (
        <div id="battlefield">
          <div className="centered center-text">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <p>{this.getMessage()}</p>
                <NewGame reset={this.reset} id={this.state.id} />
                <p className="divider"> | </p>
                <Leaderboard reset={this.reset} id={this.state.id} />
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return <Limbo />;
    }
  }
}
