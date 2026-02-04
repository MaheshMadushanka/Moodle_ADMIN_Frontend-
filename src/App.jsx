import React from 'react'
import MoodleRoutes from './routes/MoodleRoutes'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <MoodleRoutes />
    </ThemeProvider>
  )
}

export default App