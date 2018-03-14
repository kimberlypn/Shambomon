defmodule Shambomon.Game do
  @moduledoc false

  def new do
    characters = ["Charmander", "Squirtle", "Bulbasaur"]

    %{
      characters: characters
    }
  end

  def client_view(game) do
    %{
      availableCharacters: game.characters,
    }
  end
end
