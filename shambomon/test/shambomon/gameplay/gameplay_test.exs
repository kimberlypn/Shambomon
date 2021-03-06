defmodule Shambomon.GameplayTest do
  use Shambomon.DataCase

  alias Shambomon.Gameplay

  describe "matches" do
    alias Shambomon.Gameplay.Match

    @valid_attrs %{}
    @update_attrs %{}
    @invalid_attrs %{}

    def match_fixture(attrs \\ %{}) do
      {:ok, match} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Gameplay.create_match()

      match
    end

    test "list_matches/0 returns all matches" do
      match = match_fixture()
      assert Gameplay.list_matches() == [match]
    end

    test "get_match!/1 returns the match with given id" do
      match = match_fixture()
      assert Gameplay.get_match!(match.id) == match
    end

    test "create_match/1 with valid data creates a match" do
      assert {:ok, %Match{} = match} = Gameplay.create_match(@valid_attrs)
    end

    test "create_match/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Gameplay.create_match(@invalid_attrs)
    end

    test "update_match/2 with valid data updates the match" do
      match = match_fixture()
      assert {:ok, match} = Gameplay.update_match(match, @update_attrs)
      assert %Match{} = match
    end

    test "update_match/2 with invalid data returns error changeset" do
      match = match_fixture()
      assert {:error, %Ecto.Changeset{}} = Gameplay.update_match(match, @invalid_attrs)
      assert match == Gameplay.get_match!(match.id)
    end

    test "delete_match/1 deletes the match" do
      match = match_fixture()
      assert {:ok, %Match{}} = Gameplay.delete_match(match)
      assert_raise Ecto.NoResultsError, fn -> Gameplay.get_match!(match.id) end
    end

    test "change_match/1 returns a match changeset" do
      match = match_fixture()
      assert %Ecto.Changeset{} = Gameplay.change_match(match)
    end
  end
end
