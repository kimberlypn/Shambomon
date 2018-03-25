defmodule Shambomon.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Shambomon.Accounts.User
  alias Shambomon.Gameplay.Match

  schema "users" do
    field :username, :string
    field :wins, :integer
    field :losses, :integer

    field :password_hash, :string
    field :pw_tries, :integer
    field :pw_last_try, :utc_datetime

    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true

    has_many :player_matches, Match, foreign_key: :player_id
    has_many :opponent_matches, Match, foreign_key: :opponent_id
    has_many :players, through: [:opponent_matches, :player]
    has_many :opponents, through: [:player_matches, :opponent]

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :password, :password_confirmation, :wins, :losses])
    |> validate_confirmation(:password)
    |> validate_password(:password)
    |> put_pass_hash()
    |> validate_required([:username, :password_hash])
    |> update_change(:username, &String.downcase/1)
    |> unique_constraint(:username)
  end

  # Password validation
  # From Comeonin docs
  def validate_password(changeset, field, options \\ []) do
    validate_change(changeset, field, fn _, password ->
      case valid_password?(password) do
        {:ok, _} -> []
        {:error, msg} -> [{field, options[:message] || msg}]
      end
    end)
  end

  def put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, Comeonin.Argon2.add_hash(password))
  end

  def put_pass_hash(changeset), do: changeset

  def valid_password?(password) when byte_size(password) > 7 do
    {:ok, password}
  end

  def valid_password?(_), do: {:error, "The password is too short"}
end
