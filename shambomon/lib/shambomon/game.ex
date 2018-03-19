defmodule Shambomon.Game do
  @moduledoc false

  def new do
    characters = ["Charmander", "Squirtle", "Bulbasaur"]

    %{
      characters: characters,
      p1_character: "",
      p2_character: ""
    }
  end

  def client_view(game) do
    %{
      p1_character: game.p1_character,
      p2_character: game.p2_character
    }
  end
end
