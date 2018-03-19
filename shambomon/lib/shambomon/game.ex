defmodule Shambomon.Game do
  @moduledoc false

  # Resets the state of the game
  def new do
    characters = ["Charmander", "Squirtle", "Bulbasaur"]

    %{
      characters: characters,
      turn: 1,
      attacks: 0,
      p1Char: "Bulbasaur",
      p2Char: "Charmander",
      p1Health: 100,
      p2Health: 100,
      p1Attack: "",
      p2Attack: ""
    }
  end

  # Returns the current state of the game
  def client_view(game) do
    %{
      turn: game.turn,
      attacks: game.attacks,
      p1Char: game.p1Char,
      p2Char: game.p2Char,
      p1Health: game.p1Health,
      p2Health: game.p2Health,
      p1Attack: game.p1Attack,
      p2Attack: game.p2Attack
    }
  end

  # Updates the turn
  defp update_turn(game) do
    if game.turn == 1, do:
      Map.put(game, :turn, 2),
    else:
      Map.put(game, :turn, 1)
  end

  # Updates the number of attacks that have been chosen for the current round
  defp update_attacks(game) do
    if game.attacks == 0, do:
      Map.put(game, :attacks, game.attacks + 1),
    # Both players have gone, so reset the number of attacks
    else:
      Map.put(game, :attacks, 0)
  end

  # Updates the attack chosen by the current player
  defp update_player_attack(game, attk) do
    if game.turn == 1, do:
      Map.put(game, :p1Attack, attk),
    else:
      Map.put(game, :p2Attack, attk)
  end

  # Updates the given player's HP
  defp update_health(game, player) do
    if player == 1, do:
      Map.put(game, :p1Health, game.p1Health - 10),
    else:
      Map.put(game, :p2Health, game.p2Health - 10)
  end

  # Determines who won the round and calculates the damage taken accordingly
  defp determine_winner(game) do
    IO.inspect(game)
    cond do
      game.p1Attack == "Q" ->
        # Player 2 chose the superior attack
        if game.p2Attack == "W", do:
          update_health(game, 1)
        # Player 1 chose the superior attack
        if game.p2Attack == "E", do:
          update_health(game, 2)
      game.p1Attack == "W" ->
        # Player 1 chose the superior attack
        if game.p2Attack == "Q", do:
          update_health(game, 2)
        # Player 2 chose the superior attack
        if game.p2Attack == "E", do:
          update_health(game, 1)
      game.p1Attack == "E" ->
        # Player 2 chose the superior attack
        if game.p2Attack == "Q", do:
          update_health(game, 1)
        # Player 1 chose the superior attack
        if game.p2Attack == "W", do:
          update_health(game, 2)
      # Both players chose the same attack, so no damage taken
      true ->
        game
    end
  end

  # Handles an attack
  def attack(game, attk) do
    # First attack in the round
    if game.attacks == 0 do
      update_player_attack(game, attk)
      |> update_attacks()
      |> update_turn()
    # Both attacks have been chosen, so calculate damage
    else
      update_player_attack(game, attk)
      |> determine_winner()
      |> update_attacks()
      |> update_turn()
    end
  end
end
