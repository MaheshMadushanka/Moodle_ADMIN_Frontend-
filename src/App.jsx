import React from 'react'
import MoodleRoutes from './routes/MoodleRoutes'
import { ThemeProvider } from './context/ThemeContext'
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  return (
    <ThemeProvider>
      <MoodleRoutes />
      <SpeedInsights />
    </ThemeProvider>
  )
}

export default App