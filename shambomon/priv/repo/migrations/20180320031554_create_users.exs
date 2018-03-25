defmodule Shambomon.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :username, :string, null: false

      timestamps()
    end

    # Make sure that the username is unique since it is used for logging in
    create unique_index(:users, [:username])

  end
end
