import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function start_game(root, channel) {
  ReactDOM.render(<Shambomon channel={channel}/>, root);
}

class Shambomon extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      availableCharacters: [],
      p1Char: "Bulbasaur",
      p2Char: "Charmander",
      p1Health: 100,
      p2Health: 100
    };

    this.channel.join()
    .receive('ok', this.gotView.bind(this))
    .receive('error', res => {
      console.log('Unable to join', res);
    });
  }

  gotView(view) {
    this.setState(view.game);
  }

  // Renders the battlefield
  render() {
    return(
      <div>
        <div>
          <div class="row player-info">
            <div class="col-9">
              <PlayerInfo player={1} state={this.state} />
            </div>
            <Player img={"/images/" + this.state.p1Char + "-battle.png"} />
          </div>
        </div>
        <div class="row player-info" id="player-2">
          <Player img={"/images/" + this.state.p2Char + "-battle.png"} />
          <div class="col-9">
            <PlayerInfo player={2} state={this.state} />
            <Attack />
          </div>
        </div>
      </div>
    );
  }
}

function Player(props) {
  return (
    <div class="col-3">
      <img src={props.img}/>
    </div>
  );
}

// Renders a player's character and health
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

function HP(props) {
  return <div class="hp-bar"></div>;
}

function Attack(props) {
  return (
    <div class="attack">
      <span>Choose an attack: </span>
      <button>Q</button>
      <button>W</button>
      <button>E</button>
    </div>
  )
}
