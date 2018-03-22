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
      %{ name: "Onix", source: "/images/Onix.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Onix-Icon-Free-to-use-629277913" },
      %{ name: "Ninetales", source: "/images/Ninetales.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Ninetails-Icon-Free-to-use-624301461" },
      %{ name: "Gengar", source: "/images/Gengar.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Gengar-Icon-Free-to-Use-627964104" },
      %{ name: "Articuno", source: "/images/Articuno.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Articuno-Icon-Free-to-use-624068931" },
      %{ name: "Zapdos", source: "/images/Zapdos.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Zapdos-Icon-Free-to-use-624072800" },
      %{ name: "Moltres", source: "/images/Moltres.png", credits: "https://jedflah.deviantart.com/art/Minimalist-Moltres-Icon-Free-to-use-624084760" }
    ]

    render conn, "characters.html", game: params["game"], characters1: characters1, characters2: characters2
  end

  def name(conn, _params) do
    render conn, "name.html"
  end
end
