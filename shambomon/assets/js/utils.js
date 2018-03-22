// Toggles between three given pages
export function toggle_three(main, first, second) {
  var main = document.getElementById(main);
  var first = document.getElementById(first);
  var second = document.getElementById(second);
  // Show the main div and hide the instructions
  if (main.style.display == 'none') {
    main.style.display = 'inline';
    first.style.display = 'none';
    second.style.display = 'none';
  }
  // Hide the main div and show the instructions
  else {
    first.style.display = 'inline';
    main.style.display = 'none';
  }
}
