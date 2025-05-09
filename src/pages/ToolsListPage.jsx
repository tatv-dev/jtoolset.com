// src/pages/ToolsListPage.jsx
import { Link } from 'react-router-dom'
import { getAllTools, getAllCategories } from '../lib/tools'
import Card from '../components/ui/Card'
import { AdUnit } from '../lib/ads'

export default function ToolsListPage() {
  const tools = getAllTools()
  const categories = getAllCategories()
  
  // Nhóm công cụ theo danh mục
  const toolsByCategory = categories.reduce((acc, category) => {
    acc[category] = tools.filter(tool => tool.category === category)
    return acc
  }, {})
  
  return (
    <div className="space-y-10 py-6">
      {/* Nội dung từ tools-list-page artifact */}
    </div>
  )
}