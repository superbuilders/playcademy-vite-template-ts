# Vite + TypeScript + Playcademy Template

This template provides a starting point for building web-native games for the Playcademy platform using Vite and TypeScript.

## Features

- A standard Vite TypeScript setup.
- Pre-configured `@playcademy/sdk` integration with simplified initialization.
- Automatic `playcademy.manifest.json` generation using `@playcademy/vite-plugin`.
- Automatic development environment for local development with real API simulation.
- Example UI elements showing initialization status and an exit button.

## Getting Started

### Using `degit` (Recommended)

```bash
# Replace my-cademy-game with your desired project name
bunx degit superbuilders/playcademy-vite-template-ts my-cademy-game
cd my-cademy-game
bun install # or npm install / yarn install
```

## Development

Run the development server:

```bash
bun dev
# or
npm run dev
# or
yarn dev
```

The `@playcademy/vite-plugin` automatically provides a **development environment** that simulates the Playcademy platform:

- **Full Platform Simulation:** Your game runs in the same environment as production, complete with user authentication, inventory system, and all Playcademy APIs.

- **Fully Functional APIs:** SDK calls like `client.users.me()`, `client.inventory.get()`, and `client.games.saveState()` work exactly like production - no mocking required.

- **Automatic Setup:** The plugin handles all the complexity - just run `bun dev` and start building your game.

- **Hot Reload:** Changes to your game code are instantly reflected, just like standard Vite development.

## SDK Usage

The SDK is initialized directly in `src/main.ts` using:

```typescript
const client = await PlaycademyClient.init()
```

Once initialized, you can use all SDK features:

```typescript
// Get user data
const user = await client.users.me()

// Update progress
await client.games.saveState({ level: 5, score: 1000 })

// Access inventory
const inventory = await client.users.inventory.get()
```

See the example implementation in `src/main.ts`.

## Building for Playcademy

Build the production-ready assets:

```bash
bun run build
# or npm run build / yarn build
```

This command will:

1. Run Vite's build process, outputting optimized files to the `dist/` directory.
2. Trigger the `@playcademy/vite-plugin`, which will generate the `playcademy.manifest.json` file inside `dist/`. Ensure you have updated the placeholder `gameId` and `gameName` in `vite.config.ts` to match your game's details on the Playcademy platform.

The `dist/` directory will contain all the necessary files for your game. **You must create a zip file from the contents of this `dist/` directory** and upload that zip file to the Playcademy platform when creating or updating your game.

For more details on the build and upload process, please refer to the [Playcademy Documentation](https://docs.playcademy.net).

## Customization

- **Game Logic**: Implement your core game logic within the `src` directory. `src/main.ts` is the main entry point.
- **SDK Integration**: The SDK is initialized directly in `src/main.ts` - no separate files needed.
- **Styling**: Adjust UI styles in `style.css` and `src/rainbow-status.css`.
- **HTML Structure**: The base HTML is in `index.html`. Dynamic content is injected by `src/main.ts`.
- **Vite Configuration**: Add plugins or adjust build settings in `vite.config.ts`.
