# CLI Client

This is a bare-bone cli test client for testing connections and
actions to a server instance. Useful for testing that a server
is running correctly.

## Running

1. `yarn install`
2. `yarn start --uri <uri>`

When running locally and not behind SSL the default uri is generally
`ws://localhost:1337`.

Once connected you have access to the following command:

- `send <profile|options|task|start|state> <payload>`

Subcommands:

- `profile` send a profile update
- `options` send an options update
- `task` send a task update
- `start` request to start the game
- `state` request to receive the full game state

The payload is dependent on the subcommand and is a json
object of the requires message data. Non-payload commands
must provide an empty object. Examples:

- `send profile { "name": "my new name" }`
- `send profile { "name": "A", "color": "#88c0d0" }`
- `send options { "seed": 123, "isLockout": true }`
- `send start {}`
- `send state {}`

For more info run `yarn start --help`.
