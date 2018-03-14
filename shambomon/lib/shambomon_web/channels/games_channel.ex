defmodule ShambomonWeb.GamesChannel do
  use ShambomonWeb, :channel

  alias Shambomon.Game

  def join("games:" <> name, payload, socket) do
    # Get initial game on join
    #game = Shambomon.GameBackup.load(name) || Game.new()
    game = Game.new()
    # Add the game and name to socket assigns
    socket = socket
    |> assign(:game, game)
    |> assign(:name, name)

    # Send an ok message
    {:ok, %{ "join" => name, "game" => Game.client_view(game)}, socket }
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end
end
