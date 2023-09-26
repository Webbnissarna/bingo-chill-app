# Bingo Chillin' Client

The "client" is a NextJs-based web frontend that players use to play the game.
There are three major parts of the frontend; the play area, the editor, and the
component storybook.

- [Bingo Chillin' Client](#bingo-chillin-client)
  - [Getting Started](#getting-started)
    - [WSL](#wsl)
  - [The Play Area](#the-play-area)
  - [The Editor](#the-editor)

## Getting Started

Go to the appropriate and install the dependencies:

```zsh
cd packages/client
yarn
```

To run locally use `yarn dev`. To build use `yarn build`.

To run component storybook use `yarn ladle`.

### WSL

If you're using WSL on Windows and can't access the site, try using the commands
`yarn wsldev` and `yarn wslladle` instead which binds to a different address.

## The Play Area

The Play Area (or "Home") is the main part of the client web ui. From here players
can connect to a server and play the game. Most features should hopefully be
self-explanatory but a few things to keep in mind:

- The Game Board tiles are synced from server however task metadata (icons, tags
  etc.) are not, and requires each player to locally load the same setup json file.

- Session options (seed, filter tags, etc.) are only available and updated when
  connected to a server.

- When running locally and not behind SSL the default server uri is generally
  `ws://localhost:1337`.

TODO IMAGE

## The Editor

The Editor (accessed via the "Editor" button from the Play Area) is used to create
and edit custom game setup json files. The currently active game setup you're
working on is saved locally as well, in case you accidentally refresh.

TODO IMAGE
