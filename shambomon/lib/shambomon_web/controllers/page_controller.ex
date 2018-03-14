defmodule ShambomonWeb.PageController do
  use ShambomonWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, params) do
    render conn, "game.html", game: params["game"]
  end

  def characters(conn, _params) do
    render conn, "characters.html"
  end
end
