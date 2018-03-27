import React from 'react';

import NewGame from './new-game';
import Leaderboard from './leaderboard';
import Limbo from './limbo';

// Returns the end-game message corresponding to the user
function getMessage(winner, id) {
  if (winner == id) {
    return "You won!";
  }
  else {
    return "You lost!";
  }
}

// Renders the end-game message
export default function Winner(props) {
  if (!props.spectators.includes(props.id)) {
    let msg = getMessage(props.winner, props.id);

    return (
      <div id="battlefield">
        <div className="centered center-text">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <p>{msg}</p>
              <NewGame reset={props.reset} id={props.id} />
              <p className="divider"> | </p>
              <Leaderboard reset={props.reset} id={props.id} />
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
