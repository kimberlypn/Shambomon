# Taken from Nat's lecture notes

defmodule ShambomonWeb.SessionController do
  use ShambomonWeb, :controller

  alias Shambomon.Accounts
  alias Shambomon.Accounts.User

  def create(conn, %{"username" => username, "password" => password}) do
    user = get_and_auth_user(username, password)
    if user do
      conn
      |> put_session(:user_id, user.id)
      |> redirect(to: page_path(conn, :name))
    else
      conn
      |> put_flash(:error, "The information you’ve entered doesn’t match any account. Please try again.")
      |> redirect(to: page_path(conn, :index))
    end
  end

  # TODO: Move to user.ex
  def get_and_auth_user(username, password) do
    user = Accounts.get_user_by_username(username)
    case Comeonin.Argon2.check_pass(user, password) do
      {:ok, user} -> user
      _else       -> nil
    end
  end

  def delete(conn, _params) do
    conn
    |> delete_session(:user_id)
    |> redirect(to: page_path(conn, :index))
  end
end
