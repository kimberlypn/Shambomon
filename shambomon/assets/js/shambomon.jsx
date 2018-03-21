import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function start_game(root, channel, user_id) {
  ReactDOM.render(<Shambomon channel={channel} user={user_id} />, root);
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
        { id: null, char: "", health: 100, attack: "" },
        { id: null, char: "", health: 100, attack: "" }
      ],
      availableCharacters: []
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

  selectCharacter(character) {
    let p1Char = (this.state.players[0].char === "") ? character : this.state.players[0].char;
    let p2Char = (this.state.players[1].char === "") ? character : this.state.players[1].char;

    this.setState({
      players: [
        { id: null, char: p1Char, health: 100, attack: "" },
        { id: null, char: p2Char, health: 100, attack: "" }
      ]
    });
  }

  render() {
    // console.log(this.state.players);
    // if (this.state.players[0].char === "" || this.state.players[1].char === "") {
    //   return (
    //     <div className="container">
    //       <h1 className="ribbon">
    //         <div className="ribbon-content">SELECT CHARACTER</div>
    //       </h1>
    //       <div className="centered">
    //         <table id="characters">
    //           <tbody>
    //             <tr>
    //               <th>Charmander</th>
    //               <th>Squirtle</th>
    //               <th>Bulbasaur</th>
    //             </tr>
    //             <tr>
    //               <CharacterIcon character={this.state.availableCharacters[0]} select={this.selectCharacter.bind(this)} />
    //               <CharacterIcon character={this.state.availableCharacters[1]} select={this.selectCharacter.bind(this)} />
    //               <CharacterIcon character={this.state.availableCharacters[2]} select={this.selectCharacter.bind(this)} />
    //             </tr>
    //           </tbody>
    //         </table>
    //         <div className="row select">
    //           <Button className="btn btn-primary" id="select-btn">SELECT</Button>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // } else {
      console.log(this.state);
      let ready = this.isReady();
      let winner = this.hasWinner();
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
    //}
  }
}

function CharacterIcon(props) {
  let creditsLink = {
    Charmander: "https://jedflah.deviantart.com/art/Minimalist-Charmander-Icon-Free-to-Use-623942829",
    Squirtle: "https://jedflah.deviantart.com/art/Minimalist-Squirtle-Icon-Free-to-use-623939100",
    Bulbasaur: "https://jedflah.deviantart.com/art/Minimalist-Bulbasaur-Icon-Free-to-Use-623933759"
  };

  function iconClick() {
    console.log('Selected character:', props.character);
    props.select(props.character);
  }

  return (
    <td>
      {/* Image credits to Jedflah on DeviantArt */}
      <img src={"/images/" + props.character + ".png"} onClick={iconClick} className="character-icon" />
    </td>
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
