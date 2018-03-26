import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

import Waiting from './waiting';
import Winner from './winner';
import Messages from './messages';
import Battlefield from './battlefield';

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
      this.sendHistory(winner);
      this.sendStats();
      return <Winner winner={winner} id={this.user_id}
        reset={this.sendReset.bind(this)} state={this.state} />;
    }
    // Ongoing game
    else {
      return (
        <div id="battlefield">
          <div className="row container">
            <Messages state={this.state} />
            <Battlefield state={this.state} id={this.user_id}
              attack={this.sendAttack.bind(this)} />
          </div>
        </div>
      );
    }
  }
}
