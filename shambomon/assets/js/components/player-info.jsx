import React from 'react';

import HP from './hp';

// Returns a list of HP components to be rendered
function getHealthBars(health) {
  var hp = []
  for (var i = 0; i < health; i++) {
    // Use 'and' because JS is weird about double inequalities
    if ((50 < health) && (health <= 100)) {
      hp.push(<HP type={"alive"} key={i} />);
    }
    else if ((20 < health) && (health <= 50)) {
      hp.push(<HP type={"low"} key={i} />);
    }
    else {
      hp.push(<HP type={"critical"} key={i} />);
    }
  }
  for (var i = health; i < 100; i++) {
    hp.push(<HP type={"dead"} key={i} />);
  }
  return hp;
}

// Determines if the player's character name should be padded
function getPadding(pad, name) {
  if (pad) {
    return (<p id="player-name">{name}</p>);
  }
  else {
    return (<p>{name}</p>);
  }
}

// Renders the player's character name and HP
export default function PlayerInfo(props) {
  let players = props.state.players;
  let health = players[props.player].health;
  let hp = getHealthBars(health);
  let name = players[props.player].char;
  let padding = getPadding(props.left, name);

  return (
    <div>
      {padding}
      <div className="hp">
        {hp}
        <p>HP {health} / 100</p>
      </div>
    </div>
  );
}
