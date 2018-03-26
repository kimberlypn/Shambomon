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
import start_game from "./components/shambomon";

function init() {
  let mainRoot = document.getElementById('main');
  let gameRoot = document.getElementById('game');
  let charactersRoot = document.getElementById('characters');
  let user_id = $('#user-id').val();

  // Redirect to the character-selection page
  if (mainRoot) {
    $('#start-btn').click(() => {
      let gameName = $('#g-name').val();
      if (gameName) {
        window.location.href = '/game/' + gameName + '/characters';
      } else {
        alert("You must enter a game name.");
      }
    });
  }

  if (charactersRoot) {
    $('.character-icon').bind('click', function () {
      let selectedCharacter = $(this).attr('alt');
      window.location.href = '/game/' + window.gameName + '?user='
      + user_id + '&character=' + selectedCharacter;
    });
  }

  if (gameRoot) {
    let params = (new URL(document.location)).searchParams;
    let userId = params.get('user');
    let userName = params.get('username');
    let selectedCharacter = params.get('character');

    let channel = socket.channel("games:"
    + window.gameName, {
      user: userId,
      character: selectedCharacter
    });

    start_game(gameRoot, channel, user_id);
  }
}

// Use jQuery to delay until page loaded.
$(init);
