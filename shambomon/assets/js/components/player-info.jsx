import React from 'react';

import HP from './hp';

// Renders the player's character name and HP
export default function PlayerInfo(props) {
  var health, name, pokemon, pos;
  let players = props.state.players;
  health = players[props.player].health;
  name = players[props.player].char;

  var hp = []
  for (var i = 0; i < health; i++) {
    // Use 'and' because JS is weird about double inequalities
    if ((50 < health) && (health <= 100)) {
      hp.push(<HP type={"alive"} />);
    }
    else if ((20 < health) && (health <= 50)) {
      hp.push(<HP type={"low"} />);
    }
    else {
      hp.push(<HP type={"critical"} />);
    }
  }
  for (var i = health; i < 100; i++) {
    hp.push(<HP type={"dead"} />);
  }

  // Pad the bottom player's name only
  if (props.left) {
    return (
      <div>
        <p id="player-name">{name}</p>
        <div className="hp">
          {hp}
          <p>HP {health} / 100</p>
        </div>
      </div>
    );
  }
  else {
    return (
      <div>
        <p>{name}</p>
        <div className="hp">
          {hp}
          <p>HP {health} / 100</p>
        </div>
      </div>
    );
  }
}
