defmodule ShambomonWeb.GamesChannel do
  use ShambomonWeb, :channel

  alias Shambomon.Game
  alias Shambomon.GameBackup
  alias Shambomon.Accounts
  alias Shambomon.Gameplay

  def join("games:" <> name, payload, socket) do
    # Get initial game on join
    game = GameBackup.load(name) || Game.new()

    # Add the game and name to socket assigns
    socket = socket
    |> assign(:name, name)

    # Add the player to the game if it is not full
    if !Game.is_full(game), do:
      game = Game.add_player(game, payload["user"], payload["character"]),
    else:
      game = Game.add_spectator(game, payload["user"])

    # Save the game
    GameBackup.save(name, game)

    # Send the game state after joining
    send(self, {:after_join, game})

    # Send an ok message
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  def handle_info({:after_join, game}, socket) do
    # Broadcast a refresh message to update the game state
    broadcast! socket, "refresh", game

    {:noreply, socket}
  end

  # Sends to chosen attack to attack()
  def handle_in("attack", %{"attack" => a, "special" => s}, socket) do
    # Call attack() with the current game state
    game = Game.attack(GameBackup.load(socket.assigns[:name]), a, s)

    # Save game after generating new game state
    GameBackup.save(socket.assigns[:name], game)

    # Broadcast a refresh message to update the game state
    broadcast! socket, "refresh", game

    # Send an ok message
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # Resets the game
  def handle_in("reset", %{"id" => id}, socket) do
    # Remove the player from the game
    game = Game.leave(GameBackup.load(socket.assigns[:name]), id)

    # Override game with new state
    GameBackup.save(socket.assigns[:name], game)

    # Reset match_recorded flag if the game has been reset
    if !Map.get(game, :gameOver) do
      socket = socket
      |> assign(:match_recorded, false)
    end

    # Broadcast refresh message to update the game state
    broadcast! socket, "refresh", game

    # Send an ok message
    {:reply, {:ok, %{ "game" => Game.client_view(game) }}, socket}
  end

  # Updates the player's stats
  def handle_in("stats", %{"id" => id}, socket) do
    Accounts.update_stats(id)

    {:noreply, socket}
  end

  # Creates a match history record
  def handle_in("history", %{"player" => player, "opponent" => opponent,
    "player_champ" => player_champ, "opponent_champ" => opponent_champ}, socket) do
    if !socket.assigns[:match_recorded] do
      changeset =
        %{
          player_id: player,
          opponent_id: opponent,
          player_champ: player_champ,
          opponent_champ: opponent_champ
        }
      Gameplay.create_match(changeset)

      # Set flag to indicate that a match record has already been created
      # for this game
      socket = socket
      |> assign(:match_recorded, true)
    end

    {:noreply, socket}
  end
end
