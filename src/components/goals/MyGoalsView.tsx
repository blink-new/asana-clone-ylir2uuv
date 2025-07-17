import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MyGoalsView() {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create goal
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Send feedback
            </Button>
            <Button 
              variant="ghost" 
              className="text-blue-400 hover:text-blue-300"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter: Open goals
              <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">×</span>
            </Button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-sm text-gray-400 font-medium">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Time period</div>
          <div className="col-span-2">Progress</div>
          <div className="col-span-2">Owner</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-8">
              {/* Target illustration */}
              <div className="relative w-32 h-32 mx-auto">
                {/* Outer rings */}
                <div className="absolute inset-0 border-4 border-gray-600 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-gray-500 rounded-full"></div>
                <div className="absolute inset-4 border-4 border-gray-400 rounded-full"></div>
                <div className="absolute inset-6 border-4 border-red-500 rounded-full"></div>
                
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
                
                {/* Arrows */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-8 bg-red-500 transform rotate-12"></div>
                  <div className="w-3 h-3 bg-red-500 transform rotate-45 -mt-1 ml-1"></div>
                </div>
                <div className="absolute top-4 -right-2">
                  <div className="w-1 h-6 bg-red-500 transform rotate-45"></div>
                  <div className="w-2 h-2 bg-red-500 transform rotate-45 -mt-1"></div>
                </div>
                <div className="absolute bottom-6 -left-2">
                  <div className="w-1 h-6 bg-red-500 transform -rotate-12"></div>
                  <div className="w-2 h-2 bg-red-500 transform rotate-45 -mt-1 ml-1"></div>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">
              You don't own any open goals
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Add a goal or clear your filters to see all goals.
            </p>
            
            <Button 
              variant="outline" 
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              onClick={() => setFilterOpen(false)}
            >
              Clear filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}