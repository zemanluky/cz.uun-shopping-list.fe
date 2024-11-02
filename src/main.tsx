import { createRoot } from 'react-dom/client'
import './index.css'
import App from './core/App.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
