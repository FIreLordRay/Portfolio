import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts, bundled by Vite: no requests to Google.
import '@fontsource-variable/jetbrains-mono'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
