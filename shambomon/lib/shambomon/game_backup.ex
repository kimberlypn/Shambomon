defmodule Shambomon.GameBackup do
  use Agent

  # Starts the agent
  def start_link do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  # Saves the state of a game
  def save(name, game) do
    Agent.update __MODULE__, fn state ->
      Map.put(state, name, game)
    end
  end

  # Loads a saved game if it exists
  def load(name) do
    Agent.get __MODULE__, fn state ->
      Map.get(state, name)
    end
  end
end
