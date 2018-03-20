# Taken from Nat's lecture notes

defmodule ShambomonWeb.SessionController do
  use ShambomonWeb, :controller

  alias Shambomon.Accounts
  alias Shambomon.Accounts.User

  def create(conn, %{"username" => username}) do
    user = Accounts.get_user_by_username(username)
    if user do
      conn
      |> put_session(:user_id, user.id)
      |> redirect(to: page_path(conn, :index))
    else
      conn
      |> put_flash(:error, "The information you’ve entered doesn’t match any account. Please try again.")
      |> redirect(to: page_path(conn, :index))
    end
  end

  def delete(conn, _params) do
    conn
    |> delete_session(:user_id)
    |> redirect(to: page_path(conn, :index))
  end
end
