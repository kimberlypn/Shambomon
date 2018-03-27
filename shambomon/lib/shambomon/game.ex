defmodule Shambomon.Game do
  @moduledoc false

  # Resets the players array
  defp reset_players do
    player =
      %{
        id: nil,
        char: "",
        health: 100,
        attack: "",
        specialUsed: false,
        specialRoll: nil
      }

    [player, player]
  end

  # Creates a new game
  def new do
    %{
      turn: 0,
      attacks: 0,
      players: reset_players(),
      spectators: [],
      lastLosses: %{prev1: nil, prev2: nil},
      messages: [],
      gameOver: false
    }
  end

  # Returns the current state of the game
  def client_view(game) do
    %{
      turn: game.turn,
      attacks: game.attacks,
      players: game.players,
      spectators: game.spectators,
      lastLosses: game.lastLosses,
      messages: game.messages,
      gameOver: game.gameOver
    }
  end

  # Returns true if there are two players in the game or if the game is in the
  # process of resetting
  def is_full(game) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)

    (Map.get(p1, :id) && Map.get(p2, :id)) || Map.get(game, :gameOver)
  end

  # Adds the given player to the game
  def add_player(game, id, character) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    p1_id = Map.get(p1, :id)

    # Check if player should be Player 1 or Player 2
    if !p1_id do
      p1 = %{p1 | id: id, char: character}
    else
      # Make sure the same player isn't getting added twice, which can happen
      # if the user refreshes the page while waiting for the second player
      if p1_id != id do
        p2 = %{p2 | id: id, char: character}
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

    # Filter out the in-game players; otherwise, they would be added as a
    # spectator if the page refreshes
    spectators = Map.get(game, :spectators) ++ [id]
    |> Enum.uniq()
    |> Enum.filter(fn(id) -> id != p1 and id != p2 end)

    Map.put(game, :spectators, spectators)
  end

  # Updates the attack chosen by the current player
  defp update_player_attack(game, attk, special?) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)

    # Generate a random number between 1-6 (inclusive) to determine if the
    # special attack is successful
    special_roll = :rand.uniform(6)

    # Set the attack to "Special" if the special skill was activated and the
    # special roll is 6
    attack_move = if special? and special_roll == 6, do: "Special", else: attk

    # Player is only allowed to use a special attack if they haven't already
    # activated it
    if Map.get(game, :turn) == 0 do
      p1 =
        if !Map.get(p1, :specialUsed) and special?, do:
          %{p1 | attack: attack_move, specialUsed: true, specialRoll: special_roll},
        else:
          %{p1 | attack: attk, specialRoll: nil}
    else
      p2 =
        if !Map.get(p2, :specialUsed) and special?, do:
          %{p2 | attack: attack_move, specialUsed: true, specialRoll: special_roll},
        else:
          %{p2 | attack: attk, specialRoll: nil}
    end

    Map.put(game, :players, [p1, p2])
  end

  # Returns the loser according to the rules of "Rock, Paper, Scissors"
  defp compare_attacks(p1Attack, p2Attack) do
    cond do
      String.equivalent?(p1Attack, "Rock") ->
        if String.equivalent?(p2Attack, "Paper"), do: 0, else: 1
      String.equivalent?(p1Attack, "Paper") ->
        if String.equivalent?(p2Attack, "Rock"), do: 1, else: 0
      String.equivalent?(p1Attack, "Scissor") ->
        if String.equivalent?(p2Attack, "Rock"), do: 0, else: 1
      # Player 1 automatically wins if she successfully activated
      # her special attack
      String.equivalent?(p1Attack, "Special") ->
        1
    end
  end

  # Updates the messages array with the result of the special attack
  defp update_messages(game, player, special_roll, _special?) do
    msgs = Map.get(game, :messages)

    # Insert special-attack related messages in groups of three
    # so that they display correctly
    msgs = msgs ++ ["Roll value: " <> Integer.to_string(special_roll)]
    msgs =
      if special_roll == 6, do:
        msgs
          ++ ["It's super effective!"]
          ++ [player <> " used their special attack!"],
      else:
        msgs
          ++ ["But it missed!"]
          ++ [player <> " used their special attack..."]

    Map.put(game, :messages, msgs)
  end

  # Determines if the messages array needs to be updated for the special attacks
  defp handle_specials(game, p1, p2) do
    p1_special_roll = Map.get(p1, :specialRoll)
    p2_special_roll = Map.get(p2, :specialRoll)
    updated_game = game

    # Player 1 used a special attack
    if p1_special_roll != nil do
      updated_game =
        update_messages(game, p1.char, p1_special_roll, p1_special_roll != nil)
    end

    # Player 2 used a special attack
    if p2_special_roll != nil do
      updated_game =
        update_messages(game, p2.char, p2_special_roll, p2_special_roll != nil)
    end

    updated_game
  end

  # Updates the messages array with the attacks
  defp update_messages(game, p1Char, p1Attack, p2Char, p2Attack) do
    # Add the attacks chosen
    msgs = Map.get(game, :messages)
      ++ [p1Char <> " chose " <> p1Attack <> "."]
      ++ [p2Char <> " chose " <> p2Attack <> "."]

    # Add a tie message if applicable
    if String.equivalent?(p1Attack, p2Attack) do
      msgs = msgs ++ ["No damage taken."]
    end

    Map.put(game, :messages, msgs)
  end

  # Calculates the multiplier
  defp calculate_mult(reset?, last_losses, player, prev1_loser, prev2_loser) do
    # Reset the multiplier if the winning streak is broken
    if (player != prev1_loser) and (player == prev2_loser) do
      1
    # Else, calculate the multiplier
    else
      # Apply the maximum multiplier if the player has lost both times
      if reset?, do:
        2,
      # Else, multiplier is based on previous losses for the losing player
      else:
        1 + (Enum.count(Map.values(last_losses), fn(x) -> x == player end) * 0.5)
    end
  end

  # Updates the messages array with the damage dealt
  defp update_messages(game, loser, damage) do
    msgs = Map.get(game, :messages)
      ++ [loser <> " took " <> Integer.to_string(damage) <> " damage!"]

    Map.put(game, :messages, msgs)
  end

  # Decrements the player's health accordingly
  defp deal_damage(game, player, p1, p2, health_decr) do
    cond do
      player == 0 ->
        health = Map.get(p1, :health)
        p1 = Map.put(p1, :health, health - health_decr)
        game = update_messages(game, Map.get(p1, :char), health_decr)
      player == 1 ->
        health = Map.get(p2, :health)
        p2 = Map.put(p2, :health, health - health_decr)
        game = update_messages(game, Map.get(p2, :char), health_decr)
      player == nil ->
        nil
    end

    Map.put(game, :players, [p1, p2])
  end

  # Either resets lastLosses or updates it with the current loser
  defp update_last_losses(game, reset_mult?, player, prev1_loser) do
    update_losses =
      if reset_mult?, do:
        %{prev1: nil, prev2: nil},
      else:
        %{prev1: player, prev2: prev1_loser}

    Map.put(game, :lastLosses, update_losses)
  end

  # Updates the given player's HP
  defp update_health(game, player, special?) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    last_losses = Map.get(game, :lastLosses)
    prev1_loser = Map.get(last_losses, :prev1)
    prev2_loser = Map.get(last_losses, :prev2)

    # Reset multiplier if the current loser has lost the previous two times
    reset_mult? = (player == prev1_loser) and (player == prev2_loser)

    # Calculate the multiplier
    multiplier =
      calculate_mult(reset_mult?, last_losses, player, prev1_loser, prev2_loser)

    # If a special attack was successful, then the damage dealt is 40;
    # otherwise, the damage dealt is base (10) multiplied by the multiplier
    health_decr = if special?, do: 40, else: round(10 * multiplier)

    # Deal the damage
    deal_damage(game, player, p1, p2, health_decr)
    |> update_last_losses(reset_mult?, player, prev1_loser)
  end

  # Determines who won the round, and calculates the damage taken accordingly
  defp determine_winner(game) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    p1Attack = Map.get(p1, :attack)
    p2Attack = Map.get(p2, :attack)
    p2_special? = p2Attack == "Special"
    special_activated? = p1Attack == "Special" or p2_special?
    p1Char = Map.get(p1, :char)
    p2Char = Map.get(p2, :char)
    loser = nil

    # Only calculate damage if the attacks are different (no tie)
    if !String.equivalent?(p1Attack, p2Attack) do
      if !p2_special? do
        loser = compare_attacks(p1Attack, p2Attack)
      # Player 2 automatically wins if she successfully activated her
      # special attack
      else
        loser = 0
      end
    end

    # Update the messages array with the special attack messages if necessary
    handle_specials(game, p1, p2)
    # Update the messages array with the attacks
    |> update_messages(p1Char, p1Attack, p2Char, p2Attack)
    # Calculate and deal the damage
    |> update_health(loser, special_activated?)
  end

  # Updates the number of attacks that have been chosen for the current round
  defp update_attacks(game) do
    attacks = Map.get(game, :attacks)

    # Increment to the second attack in the round
    if attacks == 0, do:
      Map.put(game, :attacks, attacks + 1),
    # Both players have gone, so reset the number of attacks
    else:
      Map.put(game, :attacks, 0)
  end

  # Set the gameOver flag if applicable
  defp check_hp(game) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)

    # True if one of the player's HP is 0 or less
    if (Map.get(p1, :health) <= 0) or (Map.get(p2, :health) <= 0), do:
      Map.put(game, :gameOver, true),
    else:
      game
  end

  # Updates the turn
  defp update_turn(game) do
    # Update to Player 2's turn
    if Map.get(game, :turn) == 0, do:
      Map.put(game, :turn, 1),
    # Else, go back to Player 1
    else:
      Map.put(game, :turn, 0)
  end

  # Handles an attack
  def attack(game, attk, special?) do
    # First attack in the round
    if Map.get(game, :attacks) == 0 do
      update_player_attack(game, attk, special?)
      |> update_attacks()
      |> update_turn()
    # Both attacks have been chosen, so calculate damage
    else
      update_player_attack(game, attk, special?)
      |> determine_winner()
      |> update_attacks()
      |> check_hp()
      |> update_turn()
    end
  end

  # Removes a player from the game
  def leave(game, id) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)

    # Only reset the ID so that the win/lose message doesn't change
    if Map.get(p1, :id) == id, do:
      p1 = Map.put(p1, :id, nil),
    else:
      p2 = Map.put(p2, :id, nil)

    # Reset the game if both players have left
    if !Map.get(p1, :id) and !Map.get(p2, :id), do:
      new(),
    else:
      Map.put(game, :players, [p1, p2])
  end
end
