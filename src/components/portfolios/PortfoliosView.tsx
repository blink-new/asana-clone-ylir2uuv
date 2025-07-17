import { useState } from 'react'
import { Plus, LayoutGrid, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function PortfoliosView() {
  const [activeTab, setActiveTab] = useState<'recent' | 'browse'>('recent')

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-white mb-4">Portfolios</h1>
          
          {/* Tabs */}
          <div className="flex items-center space-x-6 mb-4">
            <button 
              className={`pb-2 border-b-2 ${
                activeTab === 'recent' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('recent')}
            >
              Recent and starred
            </button>
            <button 
              className={`pb-2 border-b-2 ${
                activeTab === 'browse' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('browse')}
            >
              Browse all
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Recent portfolios Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">Recent portfolios</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Portfolio Card */}
            <Card className="bg-[#2a2d30] border-gray-700 border-dashed hover:bg-[#3a3d40] transition-colors cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center justify-center h-32">
                  <Plus className="h-8 w-8 text-gray-400 mb-3" />
                  <span className="text-gray-400">New portfolio</span>
                </div>
              </CardContent>
            </Card>

            {/* My first portfolio */}
            <Card className="bg-[#2a2d30] border-gray-700 hover:bg-[#3a3d40] transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-4">
                    <FolderOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-medium mb-1">My first portfolio</h3>
                    <p className="text-sm text-gray-400">1 project</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}