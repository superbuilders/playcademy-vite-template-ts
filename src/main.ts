import './style.css'
import './rainbow-status.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { initializeCademy } from './playcademy-init'
import type { CademyClient } from '@playcademy/sdk'

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

// --- Application Logic ---

const statusElement =
    document.querySelector<HTMLParagraphElement>('.status-text')
const exitButton = document.querySelector<HTMLButtonElement>('#exitButton')

if (!statusElement || !exitButton) {
    console.error('Failed to find essential UI elements!')
} else {
    initializeCademy()
        .then((client: CademyClient) => {
            // --- SDK Initialized Successfully ---
            console.log('Playcademy SDK Initialized:', client)
            statusElement.textContent = 'Playcademy SDK Initialized!'

            exitButton.disabled = false
            exitButton.onclick = () => {
                if (window.self !== window.top) {
                    // Iframe mode
                    console.log(
                        '[PlaycademyInit] Attempting to exit via client.runtime.exit()...',
                    )
                    client.runtime.exit()
                } else {
                    // Standalone mode
                    console.warn(
                        '[PlaycademyInit] Exit Game clicked in Standalone Mode. No actual exit occurs.',
                    )
                    statusElement.textContent = 'Exited (Standalone Mode)'
                    statusElement.classList.add('exited')
                    exitButton.disabled = true
                }
            }

            // --- Your Game Logic Starts Here ---
            // You now have a valid 'client' instance to use.
            // For example:
            // client.users.me().then(user => console.log('User:', user));
            // client.progress.get().then(prog => console.log('Progress:', prog));
            // ------------------------------------
        })
        .catch(error => {
            // --- SDK Initialization Failed ---
            console.error('Failed to initialize Cademy client:', error)
            statusElement.textContent = `Error initializing Cademy: ${error instanceof Error ? error.message : String(error)}`
        })
}
