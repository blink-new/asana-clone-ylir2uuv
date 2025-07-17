import { useState, useEffect } from 'react'
import { Plus, Calendar, Users, Target, TrendingUp, MoreHorizontal, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TaskModal } from '@/components/modals/TaskModal'
import { ProjectModal } from '@/components/modals/ProjectModal'
import { useDatabase } from '@/hooks/useDatabase'
import { blink } from '@/blink/client'

interface Task {
  id: string
  title: string
  project: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'completed'
  assignee: string
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    project: 'Website Redesign',
    dueDate: '2024-01-20',
    priority: 'high',
    status: 'in-progress',
    assignee: 'You'
  },
  {
    id: '2',
    title: 'Review marketing materials',
    project: 'Q1 Campaign',
    dueDate: '2024-01-18',
    priority: 'medium',
    status: 'todo',
    assignee: 'Sarah'
  }
]

const mockProjects = [
  { 
    id: 'mock-1',
    name: 'National PAN Project', 
    progress: 75, 
    tasks: 12, 
    completed: 9,
    dueDate: '2 tasks due soon',
    color: '#a855f7',
    status: 'active'
  }
]

export function Dashboard() {
  const [currentDate, setCurrentDate] = useState('')
  const [greeting, setGreeting] = useState('')
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const { 
    projects, 
    tasks, 
    createTask, 
    createProject, 
    getTasksByAssignee,
    loading 
  } = useDatabase()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }
    setCurrentDate(now.toLocaleDateString('en-US', options))
    
    const hour = now.getHours()
    if (hour < 12) {
      setGreeting('Good morning')
    } else if (hour < 18) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }
  }, [])

  const handleCreateTask = () => {
    setIsTaskModalOpen(true)
  }

  const handleCreateProject = () => {
    setIsProjectModalOpen(true)
  }

  const handleSaveTask = async (taskData: any) => {
    if (!user?.id) return
    
    await createTask({
      title: taskData.title,
      description: taskData.description,
      projectId: taskData.projectId,
      assigneeId: user.id,
      creatorId: user.id,
      status: 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      tags: taskData.tags || []
    })
  }

  const handleSaveProject = async (projectData: any) => {
    if (!user?.id) return
    
    await createProject({
      name: projectData.name,
      description: projectData.description,
      color: projectData.color || '#f06a6a',
      status: 'active',
      ownerId: user.id,
      progress: 0
    })
  }

  // Get user's tasks with proper null checks - fallback to mock data if database is empty
  const userTasks = user?.id ? getTasksByAssignee(user.id) : []
  const completedTasks = (userTasks || []).filter(task => task.status === 'completed')
  const upcomingTasks = (userTasks || []).filter(task => task.status !== 'completed')
  
  // Use mock data if no real tasks exist
  const displayTasks = upcomingTasks.length > 0 ? upcomingTasks : mockTasks.filter(task => task.status !== 'completed')
  const displayCompletedCount = completedTasks.length > 0 ? completedTasks.length : mockTasks.filter(task => task.status === 'completed').length

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header Section */}
      <div className="px-6 pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm mb-2">{currentDate}</p>
            <h1 className="text-3xl font-normal text-white mb-6">
              {greeting}, ayooluwajoba
            </h1>
            
            {/* Stats Row */}
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">My week</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-white">{displayCompletedCount} tasks completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-white">{(projects || []).length > 0 ? (projects || []).length : mockProjects.length} projects</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                <Target className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* My Tasks Section */}
            <Card className="bg-[#2a2d30] border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-600 text-white text-sm">A</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white text-lg">My tasks</CardTitle>
                      <div className="flex items-center space-x-4 mt-1">
                        <button className="text-sm text-white border-b border-white pb-1">
                          Upcoming
                        </button>
                        <button className="text-sm text-gray-400 hover:text-white">
                          Overdue
                        </button>
                        <button className="text-sm text-gray-400 hover:text-white">
                          Completed
                        </button>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem className="text-white">View all tasks</DropdownMenuItem>
                      <DropdownMenuItem className="text-white">Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading.tasks ? (
                  <div className="min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-gray-400">Loading tasks...</p>
                    </div>
                  </div>
                ) : displayTasks.length > 0 ? (
                  <div className="space-y-3">
                    {displayTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 bg-[#3a3d40] rounded-lg hover:bg-[#4a4d50] transition-colors">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{task.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                            {task.dueDate && (
                              <span className="text-xs text-gray-400">
                                Due {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="w-full text-gray-400 hover:text-white border border-dashed border-gray-600 h-12"
                      onClick={handleCreateTask}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create task
                    </Button>
                  </div>
                ) : (
                  <div className="min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <Button 
                        variant="ghost" 
                        className="text-gray-400 hover:text-white border border-dashed border-gray-600 h-12"
                        onClick={handleCreateTask}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create task
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card className="bg-[#2a2d30] border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">Projects</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-400">Recents</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem className="text-white">View all projects</DropdownMenuItem>
                      <DropdownMenuItem className="text-white">Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading.projects ? (
                  <div className="min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-gray-400">Loading projects...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      className="flex items-center justify-between p-4 border border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-[#3a3d40] transition-colors"
                      onClick={handleCreateProject}
                    >
                      <div className="flex items-center space-x-3">
                        <Plus className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-400">Create project</span>
                      </div>
                    </div>
                    
                    {((projects || []).length > 0 ? projects : mockProjects).slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center space-x-3 p-3 bg-[#3a3d40] rounded-lg hover:bg-[#4a4d50] transition-colors cursor-pointer">
                        <div 
                          className="w-8 h-8 rounded flex items-center justify-center"
                          style={{ backgroundColor: project.color }}
                        >
                          <span className="text-white text-sm font-medium">📋</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{project.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={project.progress} className="w-20 h-1" />
                            <span className="text-xs text-gray-400">{project.progress}%</span>
                            <Badge variant="secondary" className="text-xs">
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* People Section */}
          <div className="mt-8 max-w-6xl mx-auto">
            <Card className="bg-[#2a2d30] border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">People</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-400">Frequent collaborators</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem className="text-white">View all people</DropdownMenuItem>
                      <DropdownMenuItem className="text-white">Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-white text-center mb-2">Invite your teammates to collaborate in Asana</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={null}
        mode="create"
      />

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        project={null}
        mode="create"
      />
    </div>
  )
}