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
      ], // information of the two users playing
      lastLosses: null, // keeps track of the last two losses for the multiplier
      spectators: [], // list of spectator ids
      messages: [], // messages to be printed in the sidebar
      gameOver: false // true if the game is over
    };

    // Refreshes the state on receiving a "refresh" broadcast on the channel
    this.channel.on("refresh", (game) => {
      this.setState(game);
    });

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
  sendReset(id) {
    this.channel.push("reset", { id: id });
  }

  // Sends a request to the server to update the user's stats
  sendStats() {
    this.channel.push("stats", {id: this.user_id});
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

  // Returns the id of the winner
  getWinner() {
    let players = this.state.players;
    // Player 2 wins
    if (players[0].health <= 0) {
      return players[1].id;
    }
    // Player 1 wins
    else {
      return players[0].id;
    }
  }

  // Main render function
  render() {
    let ready = this.isReady();
    // Game has less than two players
    if (!ready && !this.state.gameOver) {
      return <Waiting />;
    }
    // Someone has won
    else if (this.state.gameOver) {
      let winner = this.getWinner();
      //console.log("winner: " + winner);
      this.sendHistory(winner);
      this.sendStats();
      return <Winner winner={winner} id={this.user_id}
        reset={this.sendReset.bind(this)} state={this.state} />;
    }
    // Ongoing game
    else {
      return (
        <div className="row container">
          <Messages state={this.state} />
          <Battlefield state={this.state} id={this.user_id}
            attack={this.sendAttack.bind(this)} />
        </div>
      );
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

  if (!props.state.spectators.includes(props.id)) {
    return (
      <div className="centered center-text">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <p>{msg}</p>
            <NewGame reset={props.reset} id={props.id} />
            <p className="divider"> | </p>
            <Leaderboard reset={props.reset} id={props.id} />
          </div>
        </div>
      </div>
    );
  }
  else {
    return <Limbo state={props.state} />;
  }
}

// Renders a message for those who try to join a game that has just ended;
// they must wait for it to reset first
function Limbo(props) {
  return (
    <div className="centered center-text">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <p>Game is currently busy. Try again later.</p>
          <a href="/game/">BACK</a>
        </div>
      </div>
    </div>
  );
}

// Renders the attack history sidebar
function Messages(props) {
  let messages = props.state.messages;
  // Skip if no messages
  if (messages.length == 0) {
    return (
      <div className="col-md-3" id="messages">
        <h3>ATTACK HISTORY</h3>
      </div>
    );
  }
  else {
    var msgs = [];
    // Make the newest set of messages a different color
    for (var i = messages.length - 1; i >= messages.length - 3; i--) {
      msgs.push(<p className="last-messages">>> {messages[i]}</p>);
    }
    if (messages.length >= 3) {
      msgs.push(<br />);
      for (var i = messages.length - 4; i >= 0; i--) {
        msgs.push(<p>>> {messages[i]}</p>);
        // Add a space between each round
        if (i % 3 == 0) {
          msgs.push(<br />);
        }
      }
    }

    return (
      <div className="col-md-3" id="messages">
        <h3>ATTACK HISTORY</h3>
        {msgs}
      </div>
    );
  }
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
    <div className="col-md-3">
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
    // Use 'and' because JS is weird about double inequalities
    if ((50 < health) && (health <= 100)) {
      hp.push(<HP type={"alive"} />);
    }
    else if ((20 < health) && (health <= 50)) {
      hp.push(<HP type={"low"} />);
    }
    else {
      hp.push(<HP type={"critical"} />);
    }
  }
  for (var i = health; i < 100; i++) {
    hp.push(<HP type={"dead"} />);
  }

  // Pad the bottom player's name only
  if (props.left) {
    return (
      <div>
        <p id="player-name">{name}</p>
        <div className="hp">
          {hp}
          <p>HP {health} / 100</p>
        </div>
      </div>
    );
  }
  else {
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
}

// Renders an HP bar
function HP(props) {
  return (
    <div className="hp-bar" id={props.type}></div>
  );
}

// Renders the attack buttons
function Attack(props) {
  let players = props.state.players;
  var disabled = players[props.state.turn].id != props.id;

  // Don't show the attack buttons for spectators
  if (!props.state.spectators.includes(props.id)) {
    return (
      <div className="attack">
        <span>Choose an attack: </span>
        {/* Image credits to https://www.dfpeducation.com/play-the-google-game */}
        <span>
          <input type="image" src="/images/Rock.png" disabled={disabled}
            onClick={() => props.attack("Rock")} alt="Rock" />
        </span>
        <span>
          <input type="image" src="/images/Paper.png" disabled={disabled}
            onClick={() => props.attack("Paper")} alt="Paper" />
        </span>
        <span>
          <input type="image" src="/images/Scissor.png" disabled={disabled}
            onClick={() => props.attack("Scissor")} alt="Scissor" />
        </span>
      </div>
    );
  }
  else {
    return <div></div>;
    }
  }

  // Resets the game state and redirects the user back to the game name page
  function NewGame(props) {
    return (
      <a href="/game/" onClick={() => props.reset(props.id)}>New Game</a>
    );
  }

  // Resets the game state and redirects the user to the leaderboard
  function Leaderboard(props) {
    return (
      <a href="/users/" onClick={() => props.reset(props.id)}>Leaderboard</a>
    );
  }
