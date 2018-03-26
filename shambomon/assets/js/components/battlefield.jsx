import React from 'react';

import PlayerInfo from './player-info';
import Turn from './turn';
import Attack from './attack';
import Player from './player';

// Renders the battlefield, where the user's character is at the bottom
export default function Battlefield(props) {
  let players = props.state.players;
  var player, opponent;
  var playerImg, opponentImg;
  // User is Player 1
  if (players[0].id == props.id) {
    player = 0;
    opponent = 1;
    playerImg = "/images/" + players[player].char + "-battle.png";
    opponentImg = "/images/" + players[opponent].char + "-battle.png";
  }
  // User is Player 2
  else {
    player = 1;
    opponent = 0;
    playerImg = "/images/" + players[player].char + "-battle.png";
    opponentImg = "/images/" + players[opponent].char + "-battle.png";
  }

  return (
    <div className="col-md-9" id="arena">
      {/* All images taken from http://www.ign.com/pokedex/pokemon/ */}
      {/* Top */}
      <div className="row player-info">
        <div className="col-md-9">
          <PlayerInfo player={opponent} state={props.state} left={false} />
        </div>
        <Player img={opponentImg} />
      </div>
      <Turn state={props.state} id={props.id} />
      {/* Bottom */}
      <div className="row player-info">
        <Player img={playerImg} />
        <div className="col-md-9 right-side">
          <PlayerInfo player={player} state={props.state} left={true} />
          <Attack attack={props.attack} state={props.state} id={props.id} />
        </div>
      </div>
    </div>
  );
}
