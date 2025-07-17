import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Target, Users, TrendingUp, Calendar } from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  status: 'active' | 'achieved' | 'on_hold' | 'cancelled'
  progress: number
  targetValue: number
  currentValue: number
  unit: string
  dueDate: string
  ownerId: string
  color: string
  collaborators: Array<{
    id: string
    name: string
    avatar: string
    role: string
  }>
  connectedProjects: Array<{
    id: string
    name: string
    progress: number
  }>
}

interface GoalStrategyMapProps {
  goals: Goal[]
  onGoalSelect: (goal: Goal) => void
}

export function GoalStrategyMap({ goals, onGoalSelect }: GoalStrategyMapProps) {
  const [currentStep, setCurrentStep] = useState(1)

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex">
        {/* Left Panel - Welcome */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div className="max-w-md">
            <p className="text-sm text-gray-300 mb-4">Step 1 of 3</p>
            <h1 className="text-4xl font-normal text-white mb-6">
              Welcome to goals strategy map
            </h1>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Monitor and diagnose your team's goals in one view. Start by choosing a team.
            </p>
            
            <div className="mb-8">
              <label className="block text-sm text-gray-300 mb-3">Company or team</label>
              <div className="relative">
                <div className="w-full p-3 bg-[#2a2d30] border border-gray-600 rounded text-white flex items-center">
                  <Target className="mr-3 h-4 w-4 text-gray-400" />
                  agdyna.com
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white border border-gray-600"
              >
                Skip to map
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setCurrentStep(2)}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 p-12 flex items-center justify-center">
          <div className="bg-[#2a2d30] rounded-lg p-6 w-80 h-64 relative">
            <div className="text-center mb-4">
              <h3 className="text-white font-medium">agdyna.com</h3>
            </div>
            
            {/* Mock goal cards */}
            <div className="space-y-3">
              <div className="bg-slate-600 rounded p-3 h-16 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-600 rounded mb-1"></div>
                  <div className="h-1 bg-gray-700 rounded w-3/4"></div>
                </div>
                <Avatar className="h-6 w-6 ml-2">
                  <AvatarFallback className="bg-purple-600 text-white text-xs">AY</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="bg-slate-600 rounded p-3 h-16 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-600 rounded mb-1"></div>
                  <div className="h-1 bg-gray-700 rounded w-2/3"></div>
                </div>
                <Avatar className="h-6 w-6 ml-2">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">SC</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Bottom section */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-700 rounded p-2 h-12 flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <div className="flex-1">
                    <div className="h-1 bg-gray-600 rounded mb-1"></div>
                    <div className="h-1 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="bg-slate-700 rounded p-2 h-12 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <div className="flex-1">
                    <div className="h-1 bg-gray-600 rounded mb-1"></div>
                    <div className="h-1 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 2 - Goals Map View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-[#2a2d30] rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">agdyna.com</h1>
          <p className="text-gray-300">Strategy Map</p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {goals.map((goal, index) => (
            <Card 
              key={goal.id}
              className="bg-slate-600/50 border-slate-500 cursor-pointer hover:bg-slate-600/70 transition-all duration-200 transform hover:scale-105"
              onClick={() => onGoalSelect(goal)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <Badge 
                    variant={goal.status === 'achieved' ? 'default' : 'secondary'}
                    className={goal.status === 'achieved' ? 'bg-green-600' : 'bg-blue-600'}
                  >
                    {goal.status === 'achieved' ? 'Achieved' : 'Active'}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-medium text-white mb-2">{goal.title}</h3>
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{goal.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-white font-medium">{goal.progress}%</span>
                    </div>
                    <Progress 
                      value={goal.progress} 
                      className="h-2"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {goal.collaborators.length} collaborators
                      </span>
                    </div>
                    <div className="flex -space-x-1">
                      {goal.collaborators.slice(0, 3).map((collaborator) => (
                        <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-slate-600">
                          <AvatarFallback className="bg-purple-600 text-white text-xs">
                            {collaborator.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      {goal.connectedProjects.length} connected projects
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sub-goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-700/50 border-slate-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <Badge className="bg-green-600">30%</Badge>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">CSAT exceeds 95% globally</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Sub-goal</span>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-gray-600 text-white text-xs">AY</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-700/50 border-slate-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <Badge className="bg-green-600">30%</Badge>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Customer satisfaction improvement</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Sub-goal</span>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-gray-600 text-white text-xs">SC</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}