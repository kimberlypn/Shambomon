import React from 'react';

// Returns the message corresponding to the user
function getMessage(state, id) {
  let players = state.players;

  if (players[state.turn].id == id) {
    return "YOUR TURN";
  }
  else if (state.spectators.includes(id)) {
    return "YOU ARE SPECTATING";
  }
  else {
    return "OPPONENT'S TURN";
  }
}

// Renders the message indicating whose turn it is
export default function Turn(props) {
  let msg = getMessage(props.state, props.id);

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
