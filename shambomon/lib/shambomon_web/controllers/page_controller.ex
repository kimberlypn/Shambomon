defmodule ShambomonWeb.PageController do
  use ShambomonWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, params) do
    render conn, "game.html", game: params["game"]
  end

  def characters(conn, params) do
    characters1 = [
      %{ name: "Charmander", source: "/images/Charmander.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Charmander-Icon-Free-to-Use-623942829" },
      %{ name: "Squirtle", source: "/images/Squirtle.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Squirtle-Icon-Free-to-use-623939100" },
      %{ name: "Bulbasaur", source: "/images/Bulbasaur.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Bulbasaur-Icon-Free-to-Use-623933759" },
      %{ name: "Pikachu", source: "/images/Pikachu.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Pikachu-Icon-Free-to-use-623946649" },
      %{ name: "Eevee", source: "/images/Eevee.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Eevee-Icon-Free-to-Use-623949414" },
      %{ name: "Jigglypuff", source: "/images/Jigglypuff.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Jigglypuff-Icon-Free-to-use-628616339" }
    ]
    characters2 = [
      %{ name: "Onix", source: "/images/Onix.png", credits: "" },
      %{ name: "Ninetales", source: "/images/Ninetales.png", credits: "" },
      %{ name: "Gengar", source: "/images/Gengar.png", credits: "" },
      %{ name: "Articuno", source: "/images/Articuno.png", credits: "" },
      %{ name: "Zapdos", source: "/images/Zapdos.png", credits: "" },
      %{ name: "Moltres", source: "/images/Moltres.png", credits: "" }
    ]

    render conn, "characters.html", game: params["game"], characters1: characters1, characters2: characters2
  end

  def name(conn, _params) do
    render conn, "name.html"
  end
end
