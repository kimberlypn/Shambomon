defmodule Shambomon.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :username, :string, null: false

      timestamps()
    end

  end
end
