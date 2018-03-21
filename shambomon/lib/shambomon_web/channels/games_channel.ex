defmodule ShambomonWeb.GamesChannel do
  use ShambomonWeb, :channel

  alias Shambomon.Game
  alias Shambomon.GameBackup

  def join("games:" <> name, payload, socket) do
    IO.inspect(payload)
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


  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end
end
