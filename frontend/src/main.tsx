import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { UnitProvider } from './context/UnitContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <UnitProvider>
        <App />
      </UnitProvider>
    </ErrorBoundary>
  </StrictMode>,
)
