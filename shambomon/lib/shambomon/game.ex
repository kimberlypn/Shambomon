defmodule Shambomon.Game do
  @moduledoc false

  # Creates a new game
  def new do
    %{
      turn: 0,
      attacks: 0,
      players: [
        %{id: 1, char: "Charmander", health: 100, attack: ""},
        %{id: nil, char: "Squirtle", health: 100, attack: ""}
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
    (Map.get(p1, :id) != nil) && (Map.get(p2, :id) != nil)
  end

  # Adds the given player to the game
  def add_player(game, id) do
    players = Map.get(game, :players)
    p1 = Enum.at(players, 0)
    p2 = Enum.at(players, 1)
    # Check if player should be Player 1 or Player 2
    if !Map.get(p1, :id) do
      p1 = Map.put(p1, :id, id)
    else
      # Make sure the same player isn't getting added twice, which can happen
      # if the user refreshes the page while waiting for the second player
      if Map.get(p1, :id) != id do
        p2 = Map.put(p2, :id, id)
      end
    end
    Map.put(game, :players, [p1, p2])
  end

end
