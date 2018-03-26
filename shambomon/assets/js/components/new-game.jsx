import React from 'react';

// Resets the game state and redirects the user back to the game name page
export default function NewGame(props) {
  return (
    <a href="/game/" onClick={() => props.reset(props.id)}>New Game</a>
  );
}
