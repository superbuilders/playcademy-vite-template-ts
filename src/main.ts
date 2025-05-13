import './style.css'
import './rainbow-status.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

import { setupPlaycademy } from './playcademy'
import type { PlaycademyClient } from '@playcademy/sdk'

// --- Basic DOM Setup ---

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript + Playcademy</h1>
    <div class="status-container">
      <p class="status-text">
        Initializing Playcademy SDK...
      </p>
    </div>
    <button id="exitButton" disabled>Exit Game</button>
  </div>
`

// --- UI Element Selection ---
const statusElement =
    document.querySelector<HTMLParagraphElement>('.status-text')
const exitButton = document.querySelector<HTMLButtonElement>('#exitButton')

// --- Main Application Flow (IIAFE to handle async) ---
;(async () => {
    let client: PlaycademyClient | null = null

    try {
        // Step 1: Initialize the SDK
        client = await setupPlaycademy()
        // Step 2: Update template UI based on success
        updateUIToSuccess(client, statusElement, exitButton)
    } catch (error) {
        // Step 2 (Error): Update template UI based on failure
        updateUIToError(error, statusElement, exitButton)
    }

    // --- Step 3: Your Game Logic Starts Here ---
    // This block executes only if the SDK was initialized successfully (client is not null).
    if (client) {
        // The initialized 'client' instance is available here.

        // TODO: Address the behavior of client.users.me() (and similar SDK calls) in standalone/mock mode.
        // Currently, these calls attempt to reach /api/users/me (etc.), and the Vite dev server responds
        // with index.html because no actual backend is running at that path.
        // This results in the '.then(data => ...)' callback receiving HTML instead of expected API data.
        // For a better local development experience, implement a robust mocking strategy. Options include:
        // 1. Globally mocking `fetch` to intercept specific API routes and return controlled mock responses.
        // 2. Integrating a library like Mock Service Worker (msw) to create a more comprehensive mock API layer.
        // 3. Developing a sandboxed environment that can be used to use the SDK in development mode.
        // More here: https://github.com/superbuilders/playcademy/issues/19

        // Example: Get user data
        const user = await client.users.me() // This will not work in standalone mode because a mock API is not available yet.
        console.log('[Game Logic] User:', user)

        // Add your game initialization code, main loop, etc., here.
        console.log('[Game Logic] SDK is ready, start the game!')
    }
})() // <--- End of IIAFE

// --- UI Update Functions (Specific to this template) ---

function updateUIToSuccess(
    client: PlaycademyClient,
    statusEl: HTMLParagraphElement | null,
    buttonEl: HTMLButtonElement | null,
) {
    console.log('[Main] Playcademy SDK Initialized:', client)
    if (statusEl) {
        const isDevelopment = window.self === window.top
        statusEl.textContent = `Playcademy SDK Initialized!${isDevelopment ? ' [Development Mode]' : ''}`
    }
    if (buttonEl) {
        buttonEl.disabled = false

        const newButtonEl = buttonEl.cloneNode(true) as HTMLButtonElement
        buttonEl.parentNode?.replaceChild(newButtonEl, buttonEl)

        newButtonEl.onclick = () => {
            if (window.self !== window.top) {
                console.log(
                    '[Main] Attempting to exit via client.runtime.exit()...',
                )
                client.runtime.exit()
            } else {
                console.warn(
                    '[Main] Exit Game clicked in Standalone Mode. No actual exit occurs.',
                )
                if (statusEl) {
                    statusEl.textContent = 'Exited [Development Mode]'
                    statusEl.classList.add('exited')
                }
                if (newButtonEl) {
                    newButtonEl.disabled = true
                }
            }
        }
    }
}

function updateUIToError(
    error: unknown,
    statusEl: HTMLParagraphElement | null,
    buttonEl: HTMLButtonElement | null,
) {
    console.error('[Main] Failed to initialize Playcademy SDK:', error)
    if (statusEl) {
        statusEl.textContent = `Error initializing Cademy: ${error instanceof Error ? error.message : String(error)}`
        statusEl.classList.remove('rainbow')
        statusEl.classList.add('error')
    }
    if (buttonEl) {
        buttonEl.disabled = true
    }
}
