import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { toggle_three } from 'js/utils.js';

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
      ], // information of the two users playing
      spectators: [] // list of spectator ids
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
    .receive("ok", this.gotView.bind(this));
  }

  // Sends a request to the server to reset the game
  sendReset() {
    this.channel.push("reset")
    .receive("ok", console.log("Successfully reset."));
  }

  // Sends a request to the server to update the user's stats
  sendStats(winner) {
    let stats = 1
    // Send a 1 if the user won; else, send a -1
    if (this.user_id != winner) {
      stats = -1;
    }
    this.channel.push("stats", {id: this.user_id, stats: stats});
  }

  // Toggles between the help page and the game
  toggle() {
    toggle_three('battlefield', 'help-pg-1', 'help-pg-2');
  }

  // Sends a request to the server to update the user's match history
  sendHistory(winner) {
    // Only send if the user won; otherwise, two records would be added per game
    if (this.user_id == winner) {
      let players = this.state.players;
      var opponent;
      var player_champ, opponent_champ;
      if (players[0].id == this.user_id) {
        opponent = players[1].id;
        player_champ = players[0].char;
        opponent_champ = players[1].char;
      }
      else {
        opponent = players[0].id;
        player_champ = players[1].char;
        opponent_champ = players[0].char;
      }
      this.channel.push("history",
      {
        player: this.user_id,
        opponent: opponent,
        player_champ: player_champ,
        opponent_champ: opponent_champ
      });
    }
  }

  // Determines if the game is ready to start (i.e., has two players)
  isReady() {
    let players = this.state.players;
    let ready = players[0].id && players[1].id;
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
      return (
        <div>
          <Header specs={this.state.spectators.length} toggle={this.toggle.bind(this)}/>
          <div className="centered" id="battlefield">
            <Waiting />
          </div>
        </div>
      );
    }
    // Someone has won
    else if (winner) {
      this.sendStats(winner);
      this.sendHistory(winner);
      return (
        <div>
          <Header specs={this.state.spectators.length}
            toggle={this.toggle.bind(this)}/>
          <div className="centered" id="battlefield">
            <Winner winner={winner} id={this.user_id}
              reset={this.sendReset.bind(this)} />
          </div>
        </div>
      );
    }
    // Ongoing game
    else {
      return (
        <div>
          <Header specs={this.state.spectators.length}
            toggle={this.toggle.bind(this)}/>
          <div className="centered" id="battlefield">
            <Battlefield state={this.state} id={this.user_id}
              attack={this.sendAttack.bind(this)} />
          </div>
        </div>
      );
    }
  }
}

// Renders the Shambomon header, spectator count, and help link
function Header(props) {
  return (
    <div className="row">
      <div className="col-9">
        <h1 className="shambomon-header">SHAMBOMON</h1>
      </div>
      <div className="col-3">
        <div className="top-right">
          SPECTATORS: {props.specs}
          <p className="divider"> | </p>
          <a href="javascript:void(0);" onClick={props.toggle}>
            HELP
          </a>
        </div>
      </div>
    </div>
  );
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
  );
}

// Renders the end-game message
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
          <NewGame reset={props.reset} />
          <p className="divider"> | </p>
          <Leaderboard reset={props.reset} />
        </div>
      </div>
    </div>
  );
}

// Renders the battlefield, where the user's character is at the bottom
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

  return (
    <div>
      {/* Bulbasaur image credits: http://www.ign.com/pokedex/pokemon/bulbasaur */}
      {/* Charmander image credits: http://www.ign.com/pokedex/pokemon/charmander */}
      {/* Squirtle image credits: http://www.ign.com/pokedex/pokemon/squirtle */}

      {/* Top */}
      <div className="row player-info">
        <div className="col-9">
          <PlayerInfo player={opponent} state={props.state} />
        </div>
        <Player img={opponentImg} />
      </div>
      <Turn state={props.state} id={props.id} />
      {/* Bottom */}
      <div className="row player-info">
        <Player img={playerImg} />
        <div className="col-9">
          <PlayerInfo player={player} state={props.state} />
          <Attack attack={props.attack} state={props.state} id={props.id} />
        </div>
      </div>
    </div>
  );
}

// Renders the message indicating whose turn it is
function Turn(props) {
  let players = props.state.players;
  var msg = "";
  if (players[props.state.turn].id == props.id) {
    msg = "YOUR TURN";
  }
  else if (props.state.spectators.includes(props.id)) {
    msg = "YOU ARE SPECTATING";
  }
  else {
    msg = "OPPONENT'S TURN";
  }
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

// Renders the player's character
function Player(props) {
  return (
    <div className="col-3">
      <img src={props.img}/>
    </div>
  );
}

// Renders the player's character name and HP
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
      <div className="hp">
        {hp}
        <p>HP {health} / 100</p>
      </div>
    </div>
  );
}

// Renders an HP bar
function HP(props) {
  if (props.type == "alive") {
    return (
      <div className="hp-bar-alive"></div>
    );
  }
  else {
    return (
      <div className="hp-bar-dead"></div>
    );
  }
}

// Renders the attack buttons
function Attack(props) {
  let players = props.state.players;
  var disabled = players[props.state.turn].id != props.id;

  return (
    <div className="attack">
      <span>Choose an attack: </span>
      {/* Image credits to https://www.dfpeducation.com/play-the-google-game */}
      <span>
        <input type="image" src="/images/Rock.png" disabled={disabled}
          onClick={() => props.attack("Q")} alt="Rock" />
      </span>
      <span>
        <input type="image" src="/images/Paper.png" disabled={disabled}
          onClick={() => props.attack("W")} alt="Paper" />
      </span>
      <span>
        <input type="image" src="/images/Scissor.png" disabled={disabled}
          onClick={() => props.attack("E")} alt="Scissor" />
      </span>
    </div>
  );
}

// Resets the game state and redirects the user back to the game name page
function NewGame(props) {
  return (
    <a href="/game/" onClick={() => props.reset()}>New Game</a>
  );
}

// Resets the game state and redirects the user to the leaderboard
function Leaderboard(props) {
  return (
    <a href="/users/" onClick={() => props.reset()}>Leaderboard</a>
  );
}
