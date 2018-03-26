import React from 'react';

import PlayerInfo from './player-info';
import Turn from './turn';
import Attack from './attack';
import Player from './player';

// Returns 0 if the user is Player 1; else, returns 1
function getPlayer(players, id) {
  if (players[0].id == id) {
    return 0;
  }
  else {
    return 1;
  }
}

// Returns 1 if the opponent is Player 1; else, returns 0
function getOpponent(players, id) {
  if (players[0].id == id) {
    return 1;
  }
  else {
    return 0;
  }
}

// Returns the image path for the user's character
function getPlayerImg(players, id) {
  let player = getPlayer(players, id);
  return "/images/" + players[player].char + "-battle.png";
}

// Returns the image path for the opponent's character
function getOpponentImg(players, id) {
  let opponent = getOpponent(players, id);
  return "/images/" + players[opponent].char + "-battle.png";
}


// Renders the battlefield, where the user's character is at the bottom
export default function Battlefield(props) {
  let players = props.state.players;
  let player = getPlayer(players, props.id);
  let opponent = getOpponent(players, props.id);
  let playerImg = getPlayerImg(players, props.id);
  let opponentImg = getOpponentImg(players, props.id);

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
