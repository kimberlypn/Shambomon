# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :shambomon,
  ecto_repos: [Shambomon.Repo]

# Configures the endpoint
config :shambomon, ShambomonWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "u6IlJldSA9nDv2VoY+ZpI1S84JwkR40wXMSMrmysuwtWFNy7XnLvcR0QNfUkJLtb",
  render_errors: [view: ShambomonWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Shambomon.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
