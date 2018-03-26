import React from 'react';

// Renders a message for those who try to join a game that has just ended;
// they must wait for it to reset first
export default function Limbo(props) {
  return (
    <div id="battlefield">
      <div className="centered center-text">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <p>Game is currently busy. Try again later.</p>
            <a href="/game/">BACK</a>
          </div>
        </div>
      </div>
    </div>
  );
}
