# Vite + TypeScript + Playcademy Template

This template provides a starting point for building web-native games for the Playcademy platform using Vite and TypeScript.

## Features

- A standard Vite TypeScript setup.
- Pre-configured `@playcademy/sdk` integration.
- Automatic `playcademy.manifest.json` generation using `@playcademy/vite-plugin-cademy-manifest`.
- Initialization logic to handle both running within the Playcademy platform (iframe) and local standalone development.
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

- **Standalone Mode:** When you run the dev server and open the localhost URL directly in your browser, the template uses a **mock `window.PLAYCADEMY` context** defined in `src/playcademy.ts`. This allows the game to load and basic UI to function, but SDK calls will _not_ interact with a real backend.

    - The `baseUrl` in the mock context is set to `/api`. If you are running a local development server for the Playcademy API and it's _not_ proxied to `/api` by Vite, you may need to adjust the `baseUrl` in the mock context or configure Vite's proxy settings in `vite.config.ts`. See the Vite documentation for proxy configuration.
    - The `client.runtime.exit()` function will only log a warning in standalone mode, as there is no platform environment to exit.

- **Iframe Mode (Simulated):** To simulate running inside the Playcademy platform, you would typically load this development URL within an iframe in a separate local HTML file or test harness. This harness would need to use `postMessage` to send a valid `PLAYCADEMY_INIT` object (containing a real `baseUrl` and potentially `sessionToken`/`gameToken`) to the game iframe before `initializeCademy` is called in `src/main.ts`.

## SDK Access

The initialized `CademyClient` instance is available via the `cademyClient` variable exported from `src/playcademy.ts` after the `initializeCademy()` promise resolves. You can import and use this client instance in other modules as needed to interact with Playcademy APIs (e.g., `cademyClient.progress.update(...)`).

See the example `exitButton` implementation in `src/main.ts`.

## Building for Playcademy

Build the production-ready assets:

```bash
bun run build
# or npm run build / yarn build
```

This command will:

1.  Run Vite's build process, outputting optimized files to the `dist/` directory.
2.  Trigger the `@playcademy/vite-plugin-cademy-manifest`, which will generate the `playcademy.manifest.json` file inside `dist/`. Ensure you have updated the placeholder `gameId` and `gameName` in `vite.config.ts` to match your game's details on the Playcademy platform.

The `dist/` directory will contain all the necessary files for your game. **You must create a zip file from the contents of this `dist/` directory** and upload that zip file to the Playcademy platform when creating or updating your game.

For more details on the build and upload process, please refer to the [Playcademy Documentation](https://docs.playcademy.net).

## Customization

- **Game Logic**: Implement your core game logic within the `src` directory. `src/main.ts` is the main entry point.
- **Initialization**: Modify SDK initialization behavior or the mock context in `src/playcademy.ts`.
- **Styling**: Adjust UI styles in `style.css` and `src/rainbow-status.css`.
- **HTML Structure**: The base HTML is in `index.html`. Dynamic content is injected by `src/main.ts`.
- **Vite Configuration**: Add plugins or adjust build settings in `vite.config.ts`.
