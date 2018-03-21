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
      turn: 1, // current player whose turn it is
      attacks: 0, // number of attacks that have been chosen in the round
      players: [
        {id: null, char: "", health: 100, attack: ""},
        {id: null, char: "", health: 0, attack: ""}
      ]
    };

    // this.channel.join()
    // .receive("ok", this.gotView.bind(this))
    // .receive("error", res => {
    //   console.log("Unable to join", res);
    // });
  }

  // Sets the current state
  gotView(view) {
    this.setState(view.game);
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
    console.log(winner);
    if (!ready) {
      return <Waiting />;
    }
    else if (winner) {
      return <Winner winner={winner} id={this.user_id} />
    }
    else {
      return (
        <div></div>
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
