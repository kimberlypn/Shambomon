import React from 'react';

// Renders the message indicating whose turn it is
export default function Turn(props) {
  let players = props.state.players;
  var msg = "";
  if (players[props.state.turn].id == props.id) {
    msg = "YOUR TURN";
  }
  else if (props.state.spectators.includes(props.id)) {
    msg = "YOU ARE SPECTATING";
  }
  else {
    msg = "OPPONENT'S TURN";
  }
  return (
    <div className="waiting">
      {/* Image credits to http://pixelartmaker.com/art/b73566a14633720 */}
      <p>
        <img src="/images/Pokeball.png" />
        {msg}
        <img src="/images/Pokeball.png" />
      </p>
    </div>
  );
}
