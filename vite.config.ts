import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    // allowedHosts: [
    //   'shop.haiemdavang.id.vn', 
    // ],
    // hmr: {
    //     host: 'shop.haiemdavang.id.vn',
    //     // clientPort: 80,
    // },
  }
})
