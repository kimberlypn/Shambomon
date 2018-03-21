// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"
import start_game from "./shambomon";

function init() {
  let mainRoot = document.getElementById('main');
  let gameRoot = document.getElementById('game');
  let user_id = $('input#current-user').val();

  // Redirect to the character-selection page
  if (mainRoot) {
    $('#start-btn').click(() => {
      let gameName = $('input#g-name').val();
      if (gameName) {
        window.location.href = '/game/' + gameName + '/characters';
      }
      else {
        alert("You must enter a game name.");
      }
    });
  }
  // Redirect to the main game
  if (gameRoot) {
    let channel = socket.channel("games:" + window.gameName, {user: user_id});
    start_game(gameRoot, channel, user_id);
  }
}

// Use jQuery to delay until page loaded.
$(init);
