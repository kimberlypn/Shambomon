import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function start_game(root, channel) {
  ReactDOM.render(<Shambomon channel={channel} />, root);
}

class Shambomon extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      availableCharacters: [],
      turn: 1, // current player whose turn it is
      attacks: 0, // number of attacks that have been chosen in the round
      p1Char: "", // player 1's character
      p2Char: "", // player 2's character
      p1Health: 100, // player 1's HP
      p2Health: 100, // player 2's HP
      p1Attack: "", // attack chosen by player 1
      p2Attack: "" // attack chosen by player 2
    };

    this.channel.join()
      .receive('ok', this.gotView.bind(this))
      .receive('error', res => {
        console.log('Unable to join', res);
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

  selectCharacter(character) {
    let p1Char = (this.state.p1Char === "") ? character : this.state.p1Char;
    let p2Char = (this.state.p2Char === "") ? character : this.state.p2Char;

    this.setState({
      p1Char: p1Char,
      p2Char: p2Char
    });
  }

  // Renders the battlefield
  render() {
    if (this.state.p1Char === "" || this.state.p2Char === "") {
      // let characterList = _.map(this.state.availableCharacters, (character) => {
      //   return <th>{character}</th>;
      // });

      let characterRow = [];
      this.state.availableCharacters.forEach((character, i) => {
        characterRow.push(<th key={i}>{character}</th>);
      });

      return (
        <div className="container">
          <h1>Choose your character!</h1>
          <div className="centered">
            <table id="selection-table">
              <tbody>
                <tr>
                  <th>Charmander</th>
                  <th>Squirtle</th>
                  <th>Bulbasaur</th>
                </tr>
                <tr>
                  <CharacterIcon character={this.state.availableCharacters[0]} select={this.selectCharacter.bind(this)} />
                  <CharacterIcon character={this.state.availableCharacters[1]} select={this.selectCharacter.bind(this)} />
                  <CharacterIcon character={this.state.availableCharacters[2]} select={this.selectCharacter.bind(this)} />
                </tr>
              </tbody>
            </table>

            <div className="row select">
              <Button className="btn btn-primary" id="select-btn">SELECT</Button>
            </div>
          </div>
        </div>
      );
    } else {
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
      return (
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
          <div class="row player-info" id="player-2">
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

// Returns an image of the player's character
function Player(props) {
  return (
    <div class="col-3">
      <img src={props.img} />
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
    hp.push(<HP />);
  }
  return (
    <div>
      <p>{name}</p>
      <div class="hp">
        {hp}
        <p id="hp-status">HP {health} / 100</p>
      </div>
    </div>
  )
}

// Returns the a green HP bar
function HP(props) {
  return <div class="hp-bar"></div>;
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
  )
}
