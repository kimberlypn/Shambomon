defmodule ShambomonWeb.GamesChannel do
  use ShambomonWeb, :channel

  alias Shambomon.Game
  alias Shambomon.GameBackup

  def join("games:" <> name, payload, socket) do
    # Get initial game on join
    game = GameBackup.load(name) || Game.new()
    # Add the game and name to socket assigns
    socket = socket
    |> assign(:game, game)
    |> assign(:name, name)

    # Send an ok message
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client

  # Sends to chosen attack to attack()
  def handle_in("attack", %{"attack" => a}, socket) do
    # Call attack() with the current state
    game = Game.attack(socket.assigns[:game], a)
    # Update game in socket assigns
    socket = assign(socket, :game, game)
    # Save game after generating new state
    GameBackup.save(socket.assigns[:name], socket.assigns[:game])
    # Send an ok message
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end
end
