defmodule ShambomonWeb.Router do
  use ShambomonWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :get_current_user
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  # Taken from Nat's lecture notes
  def get_current_user(conn, _params) do
    # TODO: Move this function out of the router module.
    user_id = get_session(conn, :user_id)
    user = Shambomon.Accounts.get_user(user_id || -1)
    assign(conn, :current_user, user)
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ShambomonWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/game", PageController, :name
    get "/game/:game", PageController, :game
    get "/game/:game/characters", PageController, :characters

    resources "/users", UserController

    # Taken from Nat's lecture notes
    post "/session", SessionController, :create
    delete "/session", SessionController, :delete
  end

  # Other scopes may use custom stacks.
  scope "/api/v1", ShambomonWeb do
     pipe_through :api
     resources "/matches", MatchController, except: [:new, :edit]
  end
end
