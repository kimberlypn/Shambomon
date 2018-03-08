defmodule ShambomonWeb.PageController do
  use ShambomonWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
