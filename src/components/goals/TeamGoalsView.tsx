import { useState } from 'react'
import { Plus, Filter, Users, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TeamGoalsView() {
  const [selectedTeam, setSelectedTeam] = useState('')

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
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Time periods: All
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Add teams
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Copy link
            </Button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-sm text-gray-400 font-medium">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Team</div>
          <div className="col-span-2">Time period</div>
          <div className="col-span-2">Progress</div>
          <div className="col-span-2">Owner</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Team Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Team</span>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-64 bg-[#2a2d30] border-gray-600 text-white">
                  <SelectValue placeholder="Search or select team" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="no-team" className="text-white">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>No team</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ayooluwajoba-team" className="text-white">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>ayooluwajoba's first te... No goals</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-8">
              {/* Team illustration */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-16 h-20 bg-white rounded-t-full flex items-end justify-center pb-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
                <div className="w-16 h-20 bg-red-500 rounded-t-full flex items-end justify-center pb-2">
                  <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                </div>
                <div className="w-16 h-20 bg-white rounded-t-full flex items-end justify-center pb-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div className="w-20 h-2 bg-gray-600 rounded-full mx-auto mt-1"></div>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">
              Track and manage goals across multiple teams
            </h2>
            <p className="text-gray-400 text-center max-w-md mb-4">
              Use the team goals tab to track and manage goals across teams that are most relevant to you.
            </p>
            <p className="text-gray-400 text-center">
              Select "Add teams" to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}