import React from 'react';

// Renders the player's character
export default function Player(props) {
  return (
    <div className="col-md-3">
      <img src={props.img}/>
    </div>
  );
}
