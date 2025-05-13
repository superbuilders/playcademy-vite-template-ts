import { initFromWindow, CademyClient } from '@playcademy/sdk'

declare global {
    interface Window {
        CADEMY?: Record<string, unknown>
    }
}

/**
 * Initializes the Playcademy SDK client.
 *
 * This function handles:
 * - Detecting if running inside the Playcademy Platform or standalone.
 * - Listening for the CADEMY_CONTEXT message when in an iframe.
 * - Setting up a mock context for local development when running standalone.
 * - Calling the core initFromWindow function from the SDK.
 *
 * @returns A Promise that resolves with the initialized CademyClient instance
 *          or rejects if initialization fails.
 */
export function initializeCademy(): Promise<CademyClient> {
    return new Promise((resolve, reject) => {
        if (window.self !== window.top) {
            // --- IFRAME MODE (Running inside Playcademy Platform) ---
            console.log(
                '[PlaycademyInit] Running in iframe mode, waiting for CADEMY_CONTEXT...',
            )
            let contextReceived = false
            const timeoutDuration = 5000 // 5 seconds

            const handleMessage = (event: MessageEvent) => {
                if (event.data?.type === 'CADEMY_CONTEXT') {
                    console.log(
                        '[PlaycademyInit] Received CADEMY_CONTEXT:',
                        event.data.payload,
                    )
                    contextReceived = true
                    window.removeEventListener('message', handleMessage) // Clean up listener
                    clearTimeout(timeoutId) // Clear timeout

                    window.CADEMY = event.data.payload as Record<
                        string,
                        unknown
                    >

                    initFromWindow()
                        .then(client => {
                            console.log(
                                '[PlaycademyInit] SDK initialized successfully in iframe mode.',
                            )
                            resolve(client)
                        })
                        .catch(err => {
                            console.error(
                                '[PlaycademyInit] SDK initialization failed in iframe mode:',
                                err,
                            )
                            reject(err)
                        })
                }
            }

            window.addEventListener('message', handleMessage)

            // Timeout if context isn't received
            const timeoutId = setTimeout(() => {
                if (!contextReceived) {
                    window.removeEventListener('message', handleMessage) // Clean up listener
                    console.warn(
                        `[PlaycademyInit] CADEMY_CONTEXT not received within ${timeoutDuration}ms.`,
                    )
                    reject(
                        new Error(
                            'CADEMY_CONTEXT not received within timeout.',
                        ),
                    )
                }
            }, timeoutDuration)
        } else {
            // --- STANDALONE MODE (Local Development) ---
            console.log(
                '[PlaycademyInit] Running in standalone mode, setting up mock context.',
            )

            // This mock context should reflect the essential fields provided by
            // the Cademy loader in an iframe environment for client initialization.
            const mockContext = {
                // Essential for CademyClient initialization (from boot-iframe.ts context)
                baseUrl: '/api', // For local dev, Vite proxy handles this to your backend.
                // In real iframe, this is the full API base URL.
                gameToken: 'mock-game-token-for-local-dev',
                gameId: 'mock-game-id-from-template',

                // Optional: For richer local development if your game uses these directly from context
                // These are NOT part of the initial CADEMY_CONTEXT message from boot-iframe.ts
                // The SDK client typically fetches/manages user and session state itself.
                assetBaseUrl: '/assets', // If your game needs a base for assets locally
                sessionId: 'mock-session-id-for-local-dev', // For emulating an active session
                user: {
                    // For emulating a logged-in user
                    id: 'mock-user-id-dev',
                    username: 'local_developer',
                    avatarUrl: 'https://via.placeholder.com/50?text=Dev',
                },
            }

            window.CADEMY = mockContext

            // Use setTimeout to ensure the DOM is ready and to slightly mimic async loading.
            setTimeout(() => {
                initFromWindow()
                    .then(client => {
                        console.log(
                            '[PlaycademyInit] SDK initialized successfully in standalone mode (mock).',
                        )
                        resolve(client)
                    })
                    .catch(err => {
                        console.error(
                            '[PlaycademyInit] SDK initialization failed in standalone mode (mock):',
                            err,
                        )
                        reject(err)
                    })
            }, 500)
        }
    })
}
