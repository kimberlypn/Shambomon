# Shambomon
**Collaborators**: Matt Dang, Kimberly Nguyen 

**Shambomon**: http://shambomon.kimberlynguyen.solutions 

**Course Website**: http://www.ccs.neu.edu/home/ntuck/courses/2018/01/cs4550/ 

## Introduction 
Shambomon is a two-player game inspired by the two classics: [Roshambo](https://en.wikipedia.org/wiki/Rock–paper–scissors) (more 
commonly known as "Rock-Paper-Scissors") and [Pokémon](https://en.wikipedia.org/wiki/Pokémon). Each player starts off 
with 100 health points (HP), and the goal of the game is to be the first to 
bring your opponent's HP to 0. 

## Creating a Game 
When users first visit the home page, they will be prompted with a log-in form. 
![index page](screenshots/index.png) 

Users can use the "How to Play" link to open the help pages and learn how to 
play. 
![index help page 1](screenshots/index-help-pg-1.png) 
![index help page 2](screenshots/index-help-pg-2.png) 
![index help page 3](screenshots/index-help-pg-3.png) 

If users do not have an account, they can use the "Register" link to create one. 
This link will redirect them to a registration form. 
![registration form](screenshots/registration.png) 

After logging in, users will be prompted for a game name. Two users who enter 
the same game name will be placed in the same game to play against each other. 
![game name form](screenshots/game-name.png) 

There are 12 different Pokémon to choose from. 
![character selection page](screenshots/character-selection.png) 

If the room does not have two players yet, users will see a "Waiting" message 
after selecting their Pokémon. 
![waiting page](screenshots/waiting.png) 

## Gameplay 
Once a second player joins, the battlefield will be rendered. 
![battlefield page](screenshots/battlefield.png) 

Players take turns playing multiple rounds of Roshambo, using the attack buttons 
in the bottom-right. The HP bars will change color as a player's HP goes down. 
The sidebar to the left records the attacks chosen and damage taken for each 
round. 
![battlefield page mid-game](screenshots/battlefield-mid-game.png) 

Once per game, players can activate their special attack by clicking the "Star" 
attack button. Upon doing so, they will be asked to choose a default attack. If 
the attack is successful, the player will be able to deal 40 damage to her 
opponent. 
![battlefield page special attack](screenshots/battlefield-special.png) 

The message in the middle indicates whose turn it is. If users try to join a 
game that is already full, the message will indicate that they are spectating. 
Spectators can watch the game in real-time but are not allowed to play. 
![battlefield page for spectators](screenshots/battlefield-spectator.png) 

Players can use the "Help" link in the top-right to toggle the help pages. 
![in-game help page 1](screenshots/battlefield-help-pg-1.png) 
![in-game help page 2](screenshots/battlefield-help-pg-2.png) 
![in-game help page 3](screenshots/battlefield-help-pg-3.png) 

Once the game ends, players will see a message indicating whether or not they 
have won. 
![end-game page](screenshots/winner.png) 

## Leaderboard 
Users' stats will be recorded in a leaderboard after each game. Here, they can 
view their ranks and win ratios compared to those of other users. 
![leaderboard](screenshots/leaderboard.png) 

Users can also view details about individual matches by using the "Match 
History" link. Victories are highlighted in blue, while defeats are highlighted 
in pink. 
![match history page](screenshots/match-history.png) 

Have fun playing!