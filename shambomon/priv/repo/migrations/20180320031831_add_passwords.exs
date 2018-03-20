defmodule Shambomon.Repo.Migrations.AddPasswords do
  use Ecto.Migration

  # Taken from Nat's lecture notes
  def change do
    alter table("users") do
      add :password_hash, :string
      add :pw_tries, :integer, null: false, default: 0
      add :pw_last_try, :utc_datetime
    end
  end
end
