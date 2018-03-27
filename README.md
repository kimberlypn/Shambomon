# Shambomon
**Collaborators**: Matt Dang, Kimberly Nguyen 

**Shambomon**: http://shambomon.kimberlynguyen.solutions

**Course Website**: http://www.ccs.neu.edu/home/ntuck/courses/2018/01/cs4550/

## Introduction
Shambomon is a two-player game inspired by the two classics: Roshambo (more 
commonly known as "Rock-Paper-Scissors") and Pokémon. Each player starts off 
with 100 health points (HP), and the goal of the game is to be the first to 
bring your opponent's HP to 0.

## Creating a Game
When users first visit the home page, they will be prompted with a log-in form. 
![index page](screenshots/index.png) 

Users can use the "Help" link to open the help pages and learn how to play. 
![index page help](screenshots/index-help-pg-1.png) 
![index page help](screenshots/index-help-pg-2.png) 

If users do not have an account yet, they can use the "Registration" link to 
create one. This will redirect them to a registration form. 
![registration form](screenshots/registration.png) 

After logging in, users will be prompted for a game name. Two users who enter 
the same game name will be placed in the same game to play against each other. 
![game name form](screenshots/game-name.png) 

There are 12 different Pokémon to choose from. 
![character selection page](screenshots/character-selection.png) 

If the room does not have two players yet, users will see a "Waiting" message. 
![waiting page](screenshots/waiting.png) 

## Gameplay
Once a second player joins, the battlefield will be rendered. 
![battlefield page](screenshots/battlefield.png) 

Users take turns playing multiple rounds of Roshambo using the attack buttons 
below their character. The HP bars will change color as a player's HP goes down. 
The sidebar to the left records the attacks chosen and damage taken for each 
round. 
![battlefield page](screenshots/mid-game.png) 