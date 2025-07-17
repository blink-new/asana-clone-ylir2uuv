import { useState } from 'react'
import { Filter, MoreHorizontal, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function InboxView() {
  const [activeTab, setActiveTab] = useState<'activity' | 'archive' | 'sent'>('activity')

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-white mb-4">Inbox</h1>
          
          {/* Tabs */}
          <div className="flex items-center space-x-6 mb-4">
            <button 
              className={`pb-2 border-b-2 ${
                activeTab === 'activity' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button 
              className={`pb-2 border-b-2 ${
                activeTab === 'archive' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('archive')}
            >
              Archive
            </button>
            <button 
              className={`pb-2 border-b-2 ${
                activeTab === 'sent' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('sent')}
            >
              Messages I've sent
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                  >
                    Sort: Newest
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-white">Newest</DropdownMenuItem>
                  <DropdownMenuItem className="text-white">Oldest</DropdownMenuItem>
                  <DropdownMenuItem className="text-white">Priority</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Manage notifications</span>
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
                  <DropdownMenuItem className="text-white">Mark all as read</DropdownMenuItem>
                  <DropdownMenuItem className="text-white">Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          {/* Globe Icon */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="w-24 h-24 rounded-full border-4 border-gray-600 relative overflow-hidden">
              {/* Globe grid pattern */}
              <div className="absolute inset-0">
                {/* Vertical lines */}
                <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-600"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-600"></div>
                
                {/* Horizontal lines */}
                <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-600"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600"></div>
                <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-600"></div>
                
                {/* Red squares */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-red-500"></div>
                <div className="absolute top-4 right-3 w-2 h-2 bg-red-500"></div>
                <div className="absolute bottom-3 left-4 w-2 h-2 bg-red-500"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-red-500"></div>
                <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-red-500"></div>
              </div>
              
              {/* Sparkle effects */}
              <div className="absolute -top-2 -left-2">
                <div className="w-1 h-4 bg-white transform rotate-45"></div>
                <div className="w-4 h-1 bg-white transform -rotate-45 -mt-2"></div>
              </div>
              <div className="absolute -top-1 -right-3">
                <div className="w-1 h-3 bg-white transform rotate-45"></div>
                <div className="w-3 h-1 bg-white transform -rotate-45 -mt-1.5"></div>
              </div>
              <div className="absolute -bottom-2 -right-1">
                <div className="w-1 h-3 bg-white transform rotate-45"></div>
                <div className="w-3 h-1 bg-white transform -rotate-45 -mt-1.5"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-3">
            Hooray, you're up to date!
          </h2>
          <p className="text-gray-400">
            Check back later for updates on your team's work
          </p>
        </div>
      </div>
    </div>
  )
}