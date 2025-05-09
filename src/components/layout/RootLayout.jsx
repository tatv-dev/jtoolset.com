// src/components/layout/RootLayout.jsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-background text-gray-900 dark:text-dark-text transition-colors duration-200">
      <Header />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}