import { useState } from 'react'
import { ArrowLeft, Target, Users, Calendar, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

interface GoalDetailViewProps {
  goal: Goal
  onBack: () => void
}

export function GoalDetailView({ goal, onBack }: GoalDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Goals / Win customer loyalty</h1>
                  <p className="text-sm text-gray-400">{goal.title}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white"
              >
                Send feedback
              </Button>
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
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit goal
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Users className="mr-2 h-4 w-4" />
                    Manage collaborators
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete goal
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Goal Header */}
              <Card className="bg-[#2a2d30] border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">{goal.title}</h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={goal.status === 'achieved' ? 'default' : 'secondary'}
                            className={goal.status === 'achieved' ? 'bg-green-600' : 'bg-blue-600'}
                          >
                            This goal is {goal.status}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                          {goal.collaborators[0]?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-white">{goal.progress}%</span>
                      <span className="text-sm text-gray-400">/ {goal.targetValue}%</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={goal.progress} 
                        className="h-3"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      />
                      {/* Unicorn illustration for achieved goal */}
                      {goal.status === 'achieved' && (
                        <div className="absolute -top-8 right-0 text-2xl">🦄</div>
                      )}
                    </div>
                  </div>

                  {/* Connected Projects */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-white">
                        {goal.connectedProjects.length} connected projects
                      </h3>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {goal.connectedProjects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-[#3a3d40] rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-white">{project.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24">
                              <Progress value={project.progress} className="h-1" />
                            </div>
                            <span className="text-sm text-gray-400">{project.progress}%</span>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-gray-600 text-white text-xs">
                                {goal.collaborators[0]?.avatar}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="bg-[#2a2d30] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{goal.description}</p>
                </CardContent>
              </Card>

              {/* Sub-goals */}
              <Card className="bg-[#2a2d30] border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Sub-goals</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#3a3d40] rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-white">CSAT exceeds 95% globally</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24">
                          <Progress value={30} className="h-1" />
                        </div>
                        <span className="text-sm text-gray-400">30%</span>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-gray-600 text-white text-xs">AY</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* About this goal */}
              <Card className="bg-[#2a2d30] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">About this goal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Owned by</p>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                          {goal.collaborators[0]?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white">{goal.collaborators[0]?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collaborators */}
              <Card className="bg-[#2a2d30] border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Collaborators</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex -space-x-2">
                    {goal.collaborators.map((collaborator) => (
                      <Avatar key={collaborator.id} className="h-8 w-8 border-2 border-[#2a2d30]">
                        <AvatarFallback className="bg-purple-600 text-white text-xs">
                          {collaborator.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-8 h-8 rounded-full border-2 border-[#2a2d30] bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Parent goals */}
              <Card className="bg-[#2a2d30] border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Parent goals</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-[#3a3d40] rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-white">Win customer loyalty</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}