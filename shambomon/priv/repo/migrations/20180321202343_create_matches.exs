defmodule Shambomon.Repo.Migrations.CreateMatches do
  use Ecto.Migration

  def change do
    create table(:matches) do
      add :player_id, references(:users, on_delete: :delete_all), null: false
      add :opponent_id, references(:users, on_delete: :delete_all), null: false
      add :player_champ, :string
      add :opponent_champ, :string

      timestamps()
    end

    create index(:matches, [:player_id])
    create index(:matches, [:opponent_id])
  end
end
