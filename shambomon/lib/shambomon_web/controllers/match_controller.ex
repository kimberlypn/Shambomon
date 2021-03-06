defmodule ShambomonWeb.MatchController do
  use ShambomonWeb, :controller

  alias Shambomon.Gameplay
  alias Shambomon.Gameplay.Match

  action_fallback ShambomonWeb.FallbackController

  def index(conn, _params) do
    matches = Gameplay.list_matches()
    render(conn, "index.json", matches: matches)
  end

  def create(conn, %{"match" => match_params}) do
    with {:ok, %Match{} = match} <- Gameplay.create_match(match_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", match_path(conn, :show, match))
      |> render("show.json", match: match)
    end
  end

  def show(conn, %{"id" => id}) do
    match = Gameplay.get_match!(id)
    render(conn, "show.json", match: match)
  end

  def update(conn, %{"id" => id, "match" => match_params}) do
    match = Gameplay.get_match!(id)

    with {:ok, %Match{} = match} <- Gameplay.update_match(match, match_params) do
      render(conn, "show.json", match: match)
    end
  end

  def delete(conn, %{"id" => id}) do
    match = Gameplay.get_match!(id)
    with {:ok, %Match{}} <- Gameplay.delete_match(match) do
      send_resp(conn, :no_content, "")
    end
  end
end
