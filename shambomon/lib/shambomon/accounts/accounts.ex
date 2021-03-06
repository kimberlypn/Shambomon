defmodule Shambomon.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Shambomon.Repo

  alias Shambomon.Accounts.User
  alias Shambomon.Gameplay.Match

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(from User, order_by: [desc: :wins, asc: :username])
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  # Non-bang variant
  def get_user(id), do: Repo.get(User, id)

  # Gets a user by username lookup
  def get_user_by_username(username) do
    Repo.get_by(User, username: String.downcase(username))
  end

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a User.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{source: %User{}}

  """
  def change_user(%User{} = user) do
    User.changeset(user, %{})
  end

  @doc """
  Updates the player's stats based on the match history
  """
  def update_stats(user_id) do
    # Win count
    wins = Repo.one(from m in Match,
      where: m.player_id == ^user_id,
      select: count(m.id))
    # Losses count
    losses = Repo.one(from m in Match,
      where: m.opponent_id == ^user_id,
      select: count(m.id))

    user = get_user(user_id)
    update_user(user, %{wins: wins, losses: losses})
  end
end
