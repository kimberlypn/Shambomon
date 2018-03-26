import React from 'react';

// Renders the attack buttons
export default function Attack(props) {
  let players = props.state.players;
  var disabled = players[props.state.turn].id != props.id;

  // Don't show the attack buttons for spectators
  if (!props.state.spectators.includes(props.id)) {
    return (
      <div className="attack">
        <span>Choose an attack: </span>
        {/* Image credits to https://www.dfpeducation.com/play-the-google-game */}
        <span>
          <input type="image" src="/images/Rock.png" disabled={disabled}
            onClick={() => props.attack("Rock")} alt="Rock" />
        </span>
        <span>
          <input type="image" src="/images/Paper.png" disabled={disabled}
            onClick={() => props.attack("Paper")} alt="Paper" />
        </span>
        <span>
          <input type="image" src="/images/Scissor.png" disabled={disabled}
            onClick={() => props.attack("Scissor")} alt="Scissor" />
        </span>
      </div>
    );
  }
  else {
    return (<div></div>);
  }
}
