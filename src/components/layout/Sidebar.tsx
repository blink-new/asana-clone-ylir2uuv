import { useState } from 'react'
import { 
  Home, 
  CheckSquare, 
  FolderOpen, 
  Users, 
  Target, 
  Inbox, 
  Calendar, 
  BarChart3,
  Plus,
  ChevronDown,
  ChevronRight,
  Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'tasks', label: 'My tasks', icon: CheckSquare },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
]

const insightsItems = [
  { id: 'reporting', label: 'Reporting', icon: BarChart3 },
  { id: 'portfolios', label: 'Portfolios', icon: Briefcase },
  { id: 'goals', label: 'Goals', icon: Target },
]

const projectItems = [
  { id: 'projects', label: 'Projects', icon: FolderOpen },
]

const teamItems = [
  { id: 'teams', label: 'Teams', icon: Users },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(true)
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true)
  const [isTeamsExpanded, setIsTeamsExpanded] = useState(true)

  return (
    <div className="w-64 bg-[#1d1f21] border-r border-gray-700 h-full flex flex-col text-white">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
            <span className="text-sm">🏗️</span>
          </div>
          <div>
            <p className="font-medium text-sm text-white">Workbarn</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Main Navigation */}
          <div className="space-y-1 mb-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal text-gray-300 hover:text-white hover:bg-gray-800",
                    activeSection === item.id && "bg-gray-800 text-white"
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </div>

          {/* Insights Section */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="w-full justify-between text-left font-normal text-gray-400 hover:text-white mb-2"
              onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">Insights</span>
              {isInsightsExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {isInsightsExpanded && (
              <div className="space-y-1">
                {insightsItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal text-gray-300 hover:text-white hover:bg-gray-800",
                        activeSection === item.id && "bg-gray-800 text-white"
                      )}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="w-full justify-between text-left font-normal text-gray-400 hover:text-white mb-2"
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">Projects</span>
              <Plus className="h-4 w-4" />
            </Button>
            
            {isProjectsExpanded && (
              <div className="space-y-1">
                {projectItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal text-gray-300 hover:text-white hover:bg-gray-800",
                        activeSection === item.id && "bg-gray-800 text-white"
                      )}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  )
                })}
                
                {/* National PAN Project */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                  National PAN Project
                </Button>
              </div>
            )}
          </div>

          {/* Teams Section */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="w-full justify-between text-left font-normal text-gray-400 hover:text-white mb-2"
              onClick={() => setIsTeamsExpanded(!isTeamsExpanded)}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">Teams</span>
              <Plus className="h-4 w-4" />
            </Button>
            
            {isTeamsExpanded && (
              <div className="space-y-1">
                {teamItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal text-gray-300 hover:text-white hover:bg-gray-800",
                        activeSection === item.id && "bg-gray-800 text-white"
                      )}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  )
                })}
                
                {/* ayooluwajoba's first team */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                  ayooluwajoba's first...
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-400">Advanced free trial</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">14 days left</p>
        
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm mb-2"
          size="sm"
          onClick={() => window.open('https://app.asana.com/0/premium', '_blank')}
        >
          Add billing info
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full text-gray-400 hover:text-white text-sm"
          size="sm"
          onClick={() => alert('Invite teammates feature coming soon!')}
        >
          <Users className="mr-2 h-4 w-4" />
          Invite teammates
        </Button>
      </div>
    </div>
  )
}