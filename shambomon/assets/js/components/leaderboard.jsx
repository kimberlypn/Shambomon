import React from 'react';

// Resets the game state and redirects the user to the leaderboard
export default function Leaderboard(props) {
  return (
    <a href="/users/" onClick={() => props.reset(props.id)}>Leaderboard</a>
  );
}
