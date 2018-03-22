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
    if !Game.is_full(game) do
      game = Game.add_player(game, payload["user"], payload["character"])
    end

    # Save the game
    GameBackup.save(name, game)

    # Send an ok message
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client

  # Sends to chosen attack to attack()
  def handle_in("attack", %{"attack" => a}, socket) do
    # Call attack() with the current state
    game = Game.attack(GameBackup.load(socket.assigns[:name]), a)

    # Save game after generating new state
    GameBackup.save(socket.assigns[:name], game)

    # Send an ok message
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # Resets the game
  def handle_in("reset", %{}, socket) do
    # Call new() to get a fresh state
    game = Game.new()

    # Override game with new state
    GameBackup.save(socket.assigns[:name], game)

    # Send an ok message
    {:reply, {:ok, %{ "game" => Game.client_view(game) }}, socket}
  end

  # Updates the player's stats
  def handle_in("stats", %{"id" => id, "stats" => stats}, socket) do
    user = Accounts.get_user(id)
    if stats == 1 do
      Accounts.update_user(user, %{wins: user.wins + 1})
    else
      Accounts.update_user(user, %{losses: user.losses + 1})
    end

    {:noreply, socket}
  end

  # Creates a match history record
  def handle_in("history", %{"player" => player, "opponent" => opponent,
    "player_champ" => player_champ, "opponent_champ" => opponent_champ}, socket) do
    changeset =
      %{
        player_id: player,
        opponent_id: opponent,
        player_champ: player_champ,
        opponent_champ: opponent_champ
      }
    Gameplay.create_match(changeset)

    {:noreply, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end
end
