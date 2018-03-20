import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function start_game(root, channel) {
  ReactDOM.render(<Shambomon channel={ channel } />, root);
}

class Shambomon extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      turn: 1, // current player whose turn it is
      attacks: 0, // number of attacks that have been chosen in the round
      p1Char: "Bulbasaur", // player 1's character
      p2Char: "Charmander", // player 2's character
      p1Health: 50, // player 1's HP
      p2Health: 100, // player 2's HP
      p1Attack: "", // attack chosen by player 1
      p2Attack: "" // attack chosen by player 2
    };

    this.channel.join()
    .receive("ok", this.gotView.bind(this))
    .receive("error", res => {
      console.log("Unable to join", res);
    });
  }

  // Sets the current state
  gotView(view) {
    this.setState(view.game);
  }

  // Sends a request to the server to handle the logic for attacking
  sendAttack(attack) {
    this.channel.push("attack", { attack: attack })
    .receive("ok", this.gotView.bind(this))
  }

  // Renders the battlefield
  render() {
    // Check to see whose turn it is so that that person's character is
    // rendered at the bottom of the screen
    var player, opponent;
    var playerImg, opponentImg;
    if (this.state.turn == 1) {
      player = 1;
      opponent = 2;
      playerImg = "/images/" + this.state.p1Char + "-battle.png";
      opponentImg = "/images/" + this.state.p2Char + "-battle.png";
    }
    else {
      player = 2;
      opponent = 1;
      playerImg = "/images/" + this.state.p2Char + "-battle.png";
      opponentImg = "/images/" + this.state.p1Char + "-battle.png";
    }
    return(
      <div>
        <div>
          {/* Top */}
          <div class="row player-info">
            <div class="col-9">
              <PlayerInfo player={opponent} state={this.state} />
            </div>
            <Player img={opponentImg} />
          </div>
        </div>
        {/* Bottom */}
        <div class="row player-info" id="bottom-player">
          <Player img={playerImg} />
          <div class="col-9">
            <PlayerInfo player={player} state={this.state} />
            <Attack attack={this.sendAttack.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}

// Returns an image of the player's character
function Player(props) {
  return (
    <div class="col-3">
      <img src={props.img}/>
    </div>
  );
}

// Returns the player's character name and HP
function PlayerInfo(props) {
  var health, name, pokemon, pos;
  if (props.player == 1) {
    health = props.state.p1Health;
    name = props.state.p1Char;
  }
  else {
    health = props.state.p2Health;
    name = props.state.p2Char;
  }
  var hp = []
  for (var i = 0; i < health; i++) {
    hp.push(<HP type={"alive"} />);
  }
  for (var i = health; i < 100; i++) {
    hp.push(<HP type={"dead"} />);
  }
  return (
    <div>
      <p>{name}</p>
      <div class="hp">
        {hp}
        <p>HP {health} / 100</p>
      </div>
    </div>
  );
}

// Returns the a green HP bar
function HP(props) {
  if (props.type == "alive") {
    return (
      <div class="hp-bar-alive"></div>
    );
  }
  else {
    return (

      <div class="hp-bar-dead"></div>
    );
  }
}

// Returns the attack buttons
function Attack(props) {
  return (
    <div class="attack">
      <span>Choose an attack: </span>
      <button title="Tackle" onClick={() => props.attack("Q")}>Q</button>
      <button title="Double Team" onClick={() => props.attack("W")}>W</button>
      <button title="Frustration" onClick={() => props.attack("E")}>E</button>
    </div>
  );
}
