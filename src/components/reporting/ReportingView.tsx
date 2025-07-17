import { useState } from 'react'
import { Plus, ChevronDown, MoreHorizontal, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ReportingView() {
  const [activeTab, setActiveTab] = useState<'dashboards'>('dashboards')

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-white mb-4">Reporting</h1>
          
          {/* Tabs */}
          <div className="flex items-center space-x-6 mb-4">
            <button 
              className={`pb-2 border-b-2 ${
                activeTab === 'dashboards' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('dashboards')}
            >
              Dashboards
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-white">
                  <div className="flex flex-col">
                    <span className="font-medium">Dashboard</span>
                    <span className="text-sm text-gray-400">Get insights with charts using real-time data</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
        {/* Recents Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ChevronDown className="h-4 w-4 text-gray-400" />
              <h2 className="text-lg font-medium text-white">Recents</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Dashboard Card */}
            <Card className="bg-[#2a2d30] border-gray-700 border-dashed">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center justify-center h-32">
                  <Plus className="h-8 w-8 text-gray-400 mb-3" />
                  <span className="text-gray-400">Create dashboard</span>
                </div>
              </CardContent>
            </Card>

            {/* Existing Dashboard */}
            <Card className="bg-[#2a2d30] border-gray-700 hover:bg-[#3a3d40] transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-lg">📊</span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">ayooluwajoba@agdyna.com's dashboard</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Who's working on what and goals across t...
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem className="text-white">Edit dashboard</DropdownMenuItem>
                      <DropdownMenuItem className="text-white">Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-white">Share</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-purple-600 text-white text-xs">AY</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-400">owned by you</span>
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