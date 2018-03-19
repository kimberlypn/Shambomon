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
  let selectionRoot = document.getElementById('selection-table');

  if (mainRoot) {
    // redirects to the game with the inputted game name
    $('#start-btn').click(() => {
      let gameName = $('#g-name').val();
      window.location.href = '/game/' + gameName + '/characters';
    });
  }

  if (selectionRoot) {
    // adds 'selected' CSS class to clicked on character icon
    $('.character-icon').bind('click', function () {
      console.log('Selected character:', $(this).attr('alt'));
      $('.selected').removeClass('selected');
      $(this).addClass('selected');
    });

    $('#select-btn').click(() => {
      if ($('.selected').length !== 1) {
        alert('Invalid number of characters selected.');
      } else {
        //let gameRoot = document.getElementById('game');

        if (selectionRoot) {
          let channel = socket.channel("games:" + window.gameName, {});
          start_game(selectionRoot, channel);
        }
      }
    });
  }

  // if (gameRoot) {
  //   let channel = socket.channel("games:" + window.gameName, {});
  //   start_game(gameRoot, channel);
  // }
}

function selection() {
  // adds 'selected' CSS class to clicked on character icon
  $('.character-icon').bind('click', function () {
    console.log('Selected character:', $(this).attr('alt'));
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
  });

  $('#select-btn').click(() => {
    if ($('.selected').length !== 1) {
      alert('Invalid number of characters selected.');
    } else {
      let gameRoot = document.getElementById('game');

      if (gameRoot) {
        let channel = socket.channel("games:" + window.gameName, {});
        start_game(gameRoot, channel);
      }
    }
  });
}

// Use jQuery to delay until page loaded.
$(init);
