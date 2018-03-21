defmodule Shambomon.Game do
  @moduledoc false

  # Creates a new game
  def new do
    %{
      turn: 0,
      attacks: 0,
      players: [
        %{id: nil, char: "", health: 100, attack: ""},
        %{id: nil, char: "", health: 100, attack: ""}
      ]
    }
  end

  # Returns the current state of the game
  def client_view(game) do
    %{
      turn: game.turn,
      attacks: game.attacks,
      players: game.players
    }
  end

  # Returns true if there are two players in the game
  def is_full(game) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    Map.get(p1, :id) && Map.get(p2, :id)
  end

  # Adds the given player to the game
  def add_player(game, id, character) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    # Check if player should be Player 1 or Player 2
    if !Map.get(p1, :id) do
      p1 = Map.put(p1, :id, id)
      |> Map.put(:char, character)
    else
      # Make sure the same player isn't getting added twice, which can happen
      # if the user refreshes the page while waiting for the second player
      if Map.get(p1, :id) != id do
        p2 = Map.put(p2, :id, id)
        |> Map.put(:char, character)
      end
    end
    Map.put(game, :players, [p1, p2])
  end

  # Updates the turn
  defp update_turn(game) do
    if Map.get(game, :turn) == 0, do:
      Map.put(game, :turn, 1),
    else:
      Map.put(game, :turn, 0)
  end

  # Updates the number of attacks that have been chosen for the current round
  defp update_attacks(game) do
    attacks = Map.get(game, :attacks)
    if attacks == 0, do:
      Map.put(game, :attacks, attacks + 1),
    # Both players have gone, so reset the number of attacks
    else:
      Map.put(game, :attacks, 0)
  end

  # Updates the attack chosen by the current player
  defp update_player_attack(game, attk) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    if Map.get(game, :turn) == 0, do:
      p1 = Map.put(p1, :attack, attk),
    else:
      p2 = Map.put(p2, :attack, attk)
    Map.put(game, :players, [p1, p2])
  end

  # Updates the given player's HP
  defp update_health(game, player) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    if player == 0 do
      health = Map.get(p1, :health)
      p1 = Map.put(p1, :health, health - 10)
    else
      health = Map.get(p2, :health)
      p2 = Map.put(p2, :health, health - 10)
    end
    Map.put(game, :players, [p1, p2])
  end

  # Determines who won the round and calculates the damage taken accordingly;
  # Q beats E but loses to W;
  # W beats Q but loses to E;
  # E beats W but loses to Q;
  defp determine_winner(game) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    p1Attack = Map.get(p1, :attack)
    p2Attack = Map.get(p2, :attack)
    cond do
      # Both chose the same attack, so no damage taken
      String.equivalent?(p1Attack, p2Attack) ->
        game
      String.equivalent?(p1Attack, "Q") ->
        if String.equivalent?(p2Attack, "W"), do:
          update_health(game, 0),
        else:
          update_health(game, 1)
      String.equivalent?(p1Attack, "W") ->
        if String.equivalent?(p2Attack, "Q"), do:
          update_health(game, 1),
        else:
          update_health(game, 0)
      String.equivalent?(p1Attack, "E") ->
        if String.equivalent?(p2Attack, "Q"), do:
          update_health(game, 0),
        else:
          update_health(game, 1)
    end
  end

  # Handles an attack
  def attack(game, attk) do
    # First attack in the round
    if Map.get(game, :attacks) == 0 do
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
