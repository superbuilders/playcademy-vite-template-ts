import { initFromWindow, PlaycademyClient, BusEvents } from '@playcademy/sdk'

// --- Public ---

/**
 * Sets up the Playcademy environment by initializing the SDK.
 * Does NOT handle UI updates - that responsibility lies with the caller.
 * @returns A Promise that resolves with the initialized PlaycademyClient instance.
 * @throws Throws an error if initialization fails.
 */
export async function setupPlaycademy(): Promise<PlaycademyClient> {
    return initializePlaycademyInternal()
}

// --- Private (DO NOT TOUCH) ---

/**
 * (Internal) Initializes the Playcademy SDK client.
 *
 * This function handles:
 * - Detecting if running inside the Playcademy Platform or standalone.
 * - Listening for the PLAYCADEMY_INIT message when in an iframe.
 * - Setting up a mock context for local development when running standalone.
 * - Calling the core initFromWindow function from the SDK.
 *
 * @returns A Promise that resolves with the initialized PlaycademyClient instance
 *          or rejects if initialization fails.
 */
function initializePlaycademyInternal(): Promise<PlaycademyClient> {
    return new Promise((resolve, reject) => {
        if (window.self !== window.top) {
            // --- IFRAME MODE (Running inside Playcademy Platform) ---
            console.log(
                '[PlaycademyInit] Running in iframe mode, waiting for PLAYCADEMY_INIT...',
            )
            let contextReceived = false
            const timeoutDuration = 5000

            const handleMessage = (event: MessageEvent) => {
                if (event.data?.type === BusEvents.INIT) {
                    console.log(
                        `[PlaycademyInit] Received ${BusEvents.INIT}:`,
                        event.data.payload,
                    )
                    contextReceived = true
                    window.removeEventListener('message', handleMessage)
                    clearTimeout(timeoutId)

                    window.PLAYCADEMY = event.data.payload as Record<
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
                        `[PlaycademyInit] ${BusEvents.INIT} not received within ${timeoutDuration}ms.`,
                    )
                    reject(
                        new Error(
                            `${BusEvents.INIT} not received within timeout.`,
                        ),
                    )
                }
            }, timeoutDuration)
        } else {
            // --- STANDALONE MODE (Local Development) ---
            console.log(
                '[PlaycademyInit] Running in standalone mode, setting up mock context.',
            )

            const mockContext = {
                baseUrl: '/api',
                token: 'mock-game-token-for-local-dev',
                // Provide a realistic gameId - essential for the client
                gameId: 'mock-game-id-from-template',
                // Note: User data is fetched via client.users.me(), not passed in context.
            }

            window.PLAYCADEMY = mockContext

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

declare global {
    interface Window {
        PLAYCADEMY?: Record<string, unknown>
    }
}
