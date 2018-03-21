defmodule Shambomon.Repo.Migrations.AddStats do
  use Ecto.Migration

  def change do
    alter table("users") do
      add :wins, :integer, default: 0
      add :losses, :integer, default: 0
    end
  end
end
