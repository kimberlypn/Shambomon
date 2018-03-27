import React from 'react';

// Renders the attack buttons
export default function Attack(props) {
  let players = props.state.players;
  let disabled = players[props.state.turn].id != props.id;
  let specialDisabled = players[props.state.turn].specialUsed || disabled
  let specialSet = false;

  // Sends the attack and a flag indicating if the special was used
  function attack(option) {
    props.attack(option, specialSet);
  }

  // Sets the special flag to true and alerts the user to choose an attack
  function special() {
    specialSet = true;
    alert("Now choose an attack.");
  }

  // Don't show the attack buttons for spectators
  if (!props.state.spectators.includes(props.id)) {
    return (
      <div className="attack">
        <span>Choose an attack: </span>
        {/* Image credits to https://www.dfpeducation.com/play-the-google-game */}
        <span>
          <input type="image" src="/images/Rock.png" disabled={disabled}
            onClick={() => attack("Rock")} alt="Rock" />
        </span>
        <span>
          <input type="image" src="/images/Paper.png" disabled={disabled}
            onClick={() => attack("Paper")} alt="Paper" />
        </span>
        <span>
          <input type="image" src="/images/Scissor.png" disabled={disabled}
            onClick={() => attack("Scissor")} alt="Scissor" />
        </span>
        <span>
          <input type="image" src="/images/Special.png" disabled={specialDisabled}
            onClick={() => special()} alt="Special" />
        </span>
      </div>
    );
  }
  else {
    return (<div></div>);
  }
}
