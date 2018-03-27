defmodule Shambomon.Game do
  @moduledoc false

  # Creates a new game
  def new do
    %{
      turn: 0,
      attacks: 0,
      players: [
        %{id: nil, char: "", health: 100, attack: "", specialUsed: false, specialRoll: nil},
        %{id: nil, char: "", health: 100, attack: "", specialUsed: false, specialRoll: nil}
      ],
      spectators: [],
      lastLosses: %{ prev1: nil, prev2: nil },
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

    # Filter out the in-game players; else, they would be added as a spectator
    # if the page refreshes
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
  defp update_player_attack(game, attk, special?) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    # current_turn = Map.get(game, :turn)
    # current_player = if current_turn == 0, do: p1.char, else: p2.char
    # generates a random number between 1-6 to determine if the special attack is successful
    special_roll = if special?, do: :rand.uniform(6), else: nil
    # if the special skill was activated and the special roll is 6
    # specialAttk? = special? and special_roll == 6
    attack_move = if special? and special_roll == 6, do: "Special", else: attk

    if Map.get(game, :turn) == 0 do
      # p1 = if specialAttk?, do: %{ p1 | attack: "Special", specialUsed: special?, specialRoll: special_roll },
      #   else: %{ p1 | attack: attk, specialUsed: special?, specialRoll: special_roll }
      p1 = %{ p1 | attack: attack_move, specialUsed: special?, specialRoll: special_roll }
    else
      # p2 = if specialAttk?, do: %{ p2 | attack: "Special", specialUsed: special?, specialRoll: special_roll },
      #   else: %{ p2 | attack: attk, specialUsed: special?, specialRoll: special_roll }
      p2 = %{ p2 | attack: attack_move, specialUsed: special?, specialRoll: special_roll }
    end

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

    # Reset multiplier if the current loser has lost the previous two times
    reset_multiplier? = (player == prev1_loser) and (player == prev2_loser)

    # Either reset the last losses object or update it with the current loser
    update_losses = if reset_multiplier?, do: %{ prev1: nil, prev2: nil },
      else: %{ prev1: player, prev2: prev1_loser }

    # Calculate the multiplier by counting previous losses for the losing player
    multiplier = if reset_multiplier?, do: 2,
      else: 1 + (Enum.count(Map.values(last_losses), fn(x) -> x == player end) * 0.5)
    multiplier = if (player != prev1_loser) and (player == prev2_loser), do: 1,
      else: multiplier
    health_decr = round(10 * multiplier)

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

    # Update the last losses object and players' info
    %{ game | lastLosses: update_losses, players: [p1, p2] }
  end

  # Updates the messages array with the attacks
  defp update_messages(game, p1Char, p1Attack, p2Char, p2Attack) do
    msgs = Map.get(game, :messages)
    msgs = msgs
      ++ [p1Char <> " chose " <> p1Attack <> "."]
      ++ [p2Char <> " chose " <> p2Attack <> "."]


    if String.equivalent?(p1Attack, p2Attack) do
      msgs = msgs ++ ["No damage taken."]
    end

    Map.put(game, :messages, msgs)
  end

  # Updates the messages array with the damage dealt
  defp update_messages(game, loser, damage) do
    msgs = Map.get(game, :messages)
    msgs = msgs
      ++ [loser <> " took " <> Integer.to_string(damage) <> " damage!"]

    Map.put(game, :messages, msgs)
  end

  defp update_messages(game, player, special_roll, _special?) do
    msgs = Map.get(game, :messages)
    msgs = if special_roll == 6, do: msgs ++ [player <> " used their special attack! It's super effective!"],
      else: msgs ++ [player <> " used their special attack, but it missed! Roll value: " <> Integer.to_string(special_roll)]

    Map.put(game, :messages, msgs)
  end

  defp handle_specials(game, p1, p2) do
    IO.inspect(p1)
    IO.inspect(p2)
    p1_special_roll = Map.get(p1, :specialRoll)
    p2_special_roll = Map.get(p2, :specialRoll)
    updated_game = game

    if p1_special_roll != nil do
      updated_game = update_messages(updated_game, p1.char, p1_special_roll, p1_special_roll != nil)
    end

    if p2_special_roll != nil do
      updated_game = update_messages(updated_game, p2.char, p2_special_roll, p2_special_roll != nil)
    end

    updated_game
  end

  # Determines who won the round and calculates the damage taken accordingly
  defp determine_winner(game) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    p1Attack = Map.get(p1, :attack)
    p2Attack = Map.get(p2, :attack)
    p2_special? = p2Attack == "Special"
    p1Char = Map.get(p1, :char)
    p2Char = Map.get(p2, :char)
    updated_game = game
    loser = nil

    if !String.equivalent?(p1Attack, p2Attack) do
      if !p2_special? do
        cond do
          String.equivalent?(p1Attack, "Rock") ->
            if String.equivalent?(p2Attack, "Paper"), do:
              loser = 0,
            else:
              loser = 1
          String.equivalent?(p1Attack, "Paper") ->
            if String.equivalent?(p2Attack, "Rock"), do:
              loser = 1,
            else:
              loser = 0
          String.equivalent?(p1Attack, "Scissor") ->
            if String.equivalent?(p2Attack, "Rock"), do:
              loser = 0,
            else:
              loser = 1
          String.equivalent?(p1Attack, "Special") ->
            # Player 1 automatically wins if they successfully activate their special attack
            loser = 1
        end
      else
        loser = 0
      end

      updated_game = handle_specials(game, p1, p2)
    end

    # winner player number is the opposite of the loser player number and can be calculated by: |loser - 1|
    # winner = abs(loser - 1)

    update_messages(updated_game, p1Char, p1Attack, p2Char, p2Attack)
    |> update_health(loser)
  end

  # Set the gameOver flag if applicable
  defp check_hp(game) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)

    if (Map.get(p1, :health) <= 0) or (Map.get(p2, :health) <= 0), do:
      game = Map.put(game, :gameOver, true),
    else:
      game
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

    # Only reset the ID so that the win/lose message doens't change
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
