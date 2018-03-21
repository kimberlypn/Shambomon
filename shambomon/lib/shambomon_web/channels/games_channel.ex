defmodule ShambomonWeb.GamesChannel do
  use ShambomonWeb, :channel

  alias Shambomon.Game
  alias Shambomon.GameBackup

  def join("games:" <> name, payload, socket) do
    # Get initial game on join
    game = GameBackup.load(name) || Game.new()
    # Add the game and name to socket assigns
    socket = socket
    |> assign(:name, name)
    # Save the game in case it is a new one
    GameBackup.save(name, game)

    
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
