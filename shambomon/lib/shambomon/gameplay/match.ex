defmodule Shambomon.Gameplay.Match do
  use Ecto.Schema
  import Ecto.Changeset

  alias Shambomon.Gameplay.Match
  alias Shambomon.Accounts.User

  schema "matches" do
    belongs_to :player, User
    belongs_to :opponent, User
    field :player_champ, :string
    field :opponent_champ, :string

    timestamps()
  end

  @doc false
  def changeset(%Match{} = match, attrs) do
    match
    |> cast(attrs, [:player_id, :opponent_id, :player_champ, :opponent_champ])
    |> validate_required([:player_id, :opponent_id, :player_champ, :opponent_champ])
  end
end
