# Vite + TypeScript + Playcademy Template

This template provides a starting point for building web-native games for the Playcademy platform using Vite and TypeScript.

It includes:

- A standard Vite TypeScript setup.
- Pre-configured `@playcademy/sdk` integration.
- Automatic `cademy.manifest.json` generation using `@playcademy/vite-plugin-cademy-manifest`.
- Logic to handle both running within the Cademy platform (iframe) and local standalone development.

## Getting Started

### Using `degit` (Recommended)

```bash
bunx/npx degit superbuilders/playcademy-vite-template-ts my-cademy-game
cd my-cademy-game
bun install
bun dev
```

## Development

Run the development server:

```bash
bun dev
# or
npm run dev
```

- **Standalone Mode:** When you run `pnpm run dev` and open the localhost URL directly in your browser (`window.self === window.top`), the template uses a **mock `window.CADEMY` context** defined in `src/main.ts`. This allows the game to load and basic UI to function, but SDK calls will likely not interact with a real backend.
- **Iframe Mode (Simulated):** To simulate running inside Cademy, you would typically load this development URL within an iframe in a separate local HTML file or test harness that uses `postMessage` to send a `CADEMY_CONTEXT` object to the game iframe.

## SDK Access

The initialized `CademyClient` instance is stored in the `cademyClient` variable within `src/main.ts` after initialization completes. You can export it or pass it to other modules as needed to interact with Playcademy APIs (e.g., `cademyClient.progress.update(...)`).

See the example `exitButton` implementation in `src/main.ts`.

## Building for Cademy

Build the production-ready assets:

```bash
bun run build
```

This command will:

1.  Run Vite's build process, outputting optimized files to the `dist/` directory.
2.  Trigger the `@playcademy/vite-plugin-cademy-manifest`, which will:
    - Generate the `cademy.manifest.json` file inside `dist/`.
    - Create a `_playcademy_export.zip` file containing the contents of the `dist/` directory.

Upload the generated `_playcademy_export.zip` file to the Cademy platform when creating or updating your game.
