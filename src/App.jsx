// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import HomePage from './pages/HomePage'
import ToolsListPage from './pages/ToolsListPage'
import ToolPage from './pages/ToolPage'
import NotFoundPage from './pages/NotFoundPage'
import { ThemeProvider } from './context/ThemeContext'
import { SearchProvider } from './context/SearchContext'

function App() {
  return (
    <ThemeProvider>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="tools" element={<ToolsListPage />} />
            <Route path="tools/:slug" element={<ToolPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </SearchProvider>
    </ThemeProvider>
  )
}

export default App