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
      ],

      spectators: []

      lastLosses: %{ prev1: nil, prev2: nil }

    }
  end

  # Returns the current state of the game
  def client_view(game) do
    %{
      turn: game.turn,
      attacks: game.attacks,
      players: game.players,

      spectators: game.spectators

      lastLosses: game.lastLosses

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
    p1_id = Map.get(p1, :id)

    # Check if player should be Player 1 or Player 2
    if !p1_id do
      p1 = %{ p1 | id: id, char: character }
    else
      # Make sure the same player isn't getting added twice, which can happen
      # if the user refreshes the page while waiting for the second player
      if p1_id != id do
        p2 = %{ p2 | id: id, char: character }
      end
    end

    Map.put(game, :players, [p1, p2])
  end

  # Adds the given user as a spectator
  def add_spectator(game, id) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    |> Map.get(:id)
    p2 = Enum.at(players, 1)
    |> Map.get(:id)
    spectators = Map.get(game, :spectators) ++ [id]
    |> Enum.uniq()
    |> Enum.filter(fn(id) -> id != p1 and id != p2 end)
    Map.put(game, :spectators, spectators)
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
    last_losses = Map.get(game, :lastLosses)
    prev1_loser = Map.get(last_losses, :prev1)
    prev2_loser = Map.get(last_losses, :prev2)

    # multiplier should be reset when the current loser has lost the previous two times
    reset_multiplier? = (player == prev1_loser) and (player == prev2_loser)
    # either resets the last losses object or updates it with the current loser
    update_losses = if reset_multiplier?, do: %{ prev1: nil, prev2: nil }, else: %{ prev1: player, prev2: prev1_loser }
    # calculates the multiplier by counting previous losses for the losing player
    multiplier = if reset_multiplier?, do: 2,
      else: 1 + (Enum.count(Map.values(last_losses), fn(x) -> x == player end) * 0.5)
    multiplier = if (player != prev1_loser and player == prev2_loser), do: 1, else: multiplier
    health_decr = 10 * multiplier

    if player == 0 do
      health = Map.get(p1, :health)
      p1 = Map.put(p1, :health, health - health_decr)
    else
      health = Map.get(p2, :health)
      p2 = Map.put(p2, :health, health - health_decr)
    end

    # updates the last losses object and players info
    %{ game | lastLosses: update_losses, players: [p1, p2] }
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
    loser = nil

    # Both chose the same attack, so no damage taken
    if String.equivalent?(p1Attack, p2Attack) do
      game
    else
      cond do
        String.equivalent?(p1Attack, "Q") ->
          if String.equivalent?(p2Attack, "W"), do:
            loser = 0,
          else:
            loser = 1
        String.equivalent?(p1Attack, "W") ->
          if String.equivalent?(p2Attack, "Q"), do:
            loser = 1,
          else:
            loser = 0
        String.equivalent?(p1Attack, "E") ->
          if String.equivalent?(p2Attack, "Q"), do:
            loser = 0,
          else:
            loser = 1
      end

      update_health(game, loser)
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
