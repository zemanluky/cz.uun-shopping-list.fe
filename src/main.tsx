import * as React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './core'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
