import React from 'react';

import NewGame from './new-game';
import Leaderboard from './leaderboard';
import Limbo from './limbo';

// Renders the end-game message
export default function Winner(props) {
  var msg = "";
  if (props.winner == props.id) {
    msg = "You won!";
  }
  else {
    msg = "You lost!";
  }

  if (!props.state.spectators.includes(props.id)) {
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
    return <Limbo state={props.state} />;
  }
}
