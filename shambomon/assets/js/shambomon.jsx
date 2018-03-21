import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function start_game(root, channel, user_id) {
  ReactDOM.render(<Shambomon channel={ channel } user={ user_id } />, root);
}

class Shambomon extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.user_id = props.user;
    this.state = {
      turn: 0, // current player whose turn it is
      attacks: 0, // number of attacks that have been chosen in the round
      players: [
        {id: null, char: "", health: 100, attack: ""},
        {id: null, char: "", health: 100, attack: ""}
      ]
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

  // Determines if the game is ready to start (i.e., has two players)
  isReady() {
    let players = this.state.players;
    let ready = (players[0].id != null) && (players[1].id != null);
    return ready;
  }

  // Returns the id of the winner; else returns false
  hasWinner() {
    let players = this.state.players;
    // Player 2 wins
    if (players[0].health <= 0) {
      return players[1].id;
    }
    // Player 1 wins
    else if (players[1].health <= 0) {
      return players[0].id;
    }
    // No one has won yet
    else {
      return false;
    }
  }

  render() {
    let ready = this.isReady();
    let winner = this.hasWinner();
    // Game has less than two players
    if (!ready) {
      return <Waiting />;
    }
    // Someone has won
    else if (winner) {
      return <Winner winner={winner} id={this.user_id} />;
    }
    // Ongoing game
    else {
      return <Battlefield state={this.state} id={this.user_id} attack={this.sendAttack.bind(this)}/>;
    }
  }
}

// Renders a waiting message
function Waiting() {
  return (
    <div className="centered center-text">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <p>Waiting for another player...</p>
        </div>
      </div>
    </div>
  )
}

// Renders a winner message
function Winner(props) {
  var msg = "";
  if (props.winner == props.id) {
    msg = "You won!";
  }
  else {
    msg = "You lost!";
  }
  return (
    <div className="centered center-text">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <p>{msg}</p>
        </div>
      </div>
    </div>
  )
}

// Renders the battlefield, where the user's player is at the bottom
function Battlefield(props) {
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

  return(
    <div>
      <div>
        {/* Top */}
        <div class="row player-info">
          <div class="col-9">
            <PlayerInfo player={opponent} state={props.state} />
          </div>
          <Player img={opponentImg} />
        </div>
      </div>
      {/* Bottom */}
      <div class="row player-info" id="bottom-player">
        <Player img={playerImg} />
        <div class="col-9">
          <PlayerInfo player={player} state={props.state} />
          <Attack attack={props.attack} />
        </div>
      </div>
    </div>
  );
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
  let players = props.state.players;
  health = players[props.player].health;
  name = players[props.player].char;

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
