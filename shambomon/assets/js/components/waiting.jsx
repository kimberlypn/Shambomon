import React from 'react';

// Renders a waiting message
export default function Waiting() {
  return (
    <div id="battlefield">
      <div className="centered center-text">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <p>Waiting for another player...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
