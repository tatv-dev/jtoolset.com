// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom'
import { getFeaturedTools } from '../lib/tools'

export default function NotFoundPage() {
  const featuredTools = getFeaturedTools().slice(0, 3)

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      {/* Nội dung từ not-found-page artifact */}
    </div>
  )
}