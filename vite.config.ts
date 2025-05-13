import { defineConfig } from 'vite'
import { cademyManifestPlugin } from '@playcademy/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        cademyManifestPlugin({
            bootMode: 'iframe',
            entryPoint: 'index.html',
        }),
    ],
})
