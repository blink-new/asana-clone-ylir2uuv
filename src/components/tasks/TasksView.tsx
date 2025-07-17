import { useState, useEffect } from 'react'
import { Plus, Filter, MoreHorizontal, Calendar, User, Flag, ChevronDown, List, LayoutGrid, Share, Settings, Edit, Trash2, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TaskModal } from '@/components/modals/TaskModal'
import { useDatabase } from '@/hooks/useDatabase'
import { blink } from '@/blink/client'

interface Task {
  id: string
  title: string
  description?: string
  project: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'completed'
  assignee: string
  completed: boolean
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new homepage',
    project: 'Website Redesign',
    dueDate: '2024-01-20',
    priority: 'high',
    status: 'in-progress',
    assignee: 'You',
    completed: false
  },
  {
    id: '2',
    title: 'Review marketing materials',
    description: 'Check all copy and images for Q1 campaign',
    project: 'Q1 Campaign',
    dueDate: '2024-01-18',
    priority: 'medium',
    status: 'todo',
    assignee: 'Sarah',
    completed: false
  },
  {
    id: '3',
    title: 'Update user documentation',
    description: 'Revise help articles and user guides',
    project: 'Customer Support Portal',
    dueDate: '2024-01-25',
    priority: 'low',
    status: 'todo',
    assignee: 'Mike',
    completed: false
  },
  {
    id: '4',
    title: 'Conduct user interviews',
    description: 'Schedule and conduct 10 user interviews for research',
    project: 'User Research Study',
    dueDate: '2024-01-22',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Emma',
    completed: false
  }
]

export function TasksView() {
  const { tasks, updateTask, deleteTask, createTask, loading } = useDatabase()
  const [user, setUser] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar' | 'files'>('list')
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [filterStatus, setFilterStatus] = useState<'all' | 'incomplete' | 'completed'>('incomplete')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed'
      await updateTask(taskId, { 
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
      })
    }
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setModalMode('create')
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task: any) => {
    setSelectedTask(task)
    setModalMode('edit')
    setIsTaskModalOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId)
  }

  const handleSaveTask = async (taskData: any) => {
    if (!user?.id) return
    
    if (modalMode === 'create') {
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
    } else {
      await updateTask(taskData.id, taskData)
    }
  }

  const filteredTasks = tasks.filter(task => {
    switch (filterStatus) {
      case 'completed':
        return task.completed
      case 'incomplete':
        return !task.completed
      default:
        return true
    }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 text-white">Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-600 text-white">In Progress</Badge>
      default:
        return <Badge className="bg-gray-600 text-white">To Do</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-600 text-white text-sm">AY</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-white flex items-center">
                  My tasks
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                <Settings className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center space-x-6">
            <button 
              className={`flex items-center space-x-2 px-3 py-2 rounded ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </button>
            <button 
              className={`flex items-center space-x-2 px-3 py-2 rounded ${
                viewMode === 'board' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setViewMode('board')}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Board</span>
            </button>
            <button 
              className={`flex items-center space-x-2 px-3 py-2 rounded ${
                viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </button>
            <button 
              className={`flex items-center space-x-2 px-3 py-2 rounded ${
                viewMode === 'files' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setViewMode('files')}
            >
              <span>Files</span>
            </button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
                onClick={handleCreateTask}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add task
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters: 1
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem 
                    className="text-white"
                    onClick={() => setFilterStatus('all')}
                  >
                    All tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white"
                    onClick={() => setFilterStatus('incomplete')}
                  >
                    Incomplete tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white"
                    onClick={() => setFilterStatus('completed')}
                  >
                    Completed tasks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                Sort
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                Group
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                Options
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-3">
          <div className="grid grid-cols-12 gap-4 text-sm text-gray-400 font-medium">
            <div className="col-span-5">Name</div>
            <div className="col-span-2">Due date</div>
            <div className="col-span-2">Collaborators</div>
            <div className="col-span-2">Projects</div>
            <div className="col-span-1">Task visibility</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-gray-400 mb-4">
              {filterStatus === 'completed' 
                ? "You haven't completed any tasks yet." 
                : filterStatus === 'incomplete'
                ? "All caught up! No incomplete tasks."
                : "No tasks available."}
            </p>
            <Button onClick={handleCreateTask} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create your first task
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="bg-[#2a2d30] border-gray-700 hover:bg-[#3a3d40] transition-colors">
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Checkbox and Task Name */}
                    <div className="col-span-5 flex items-center space-x-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="border-gray-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {task.title}
                          </h4>
                          <Flag className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          {getStatusBadge(task.status)}
                        </div>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="col-span-2">
                      {task.dueDate && (
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Assignee */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-purple-600 text-white text-xs">
                            {task.assignee.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-400">{task.assignee}</span>
                      </div>
                    </div>

                    {/* Project */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-400">{task.project}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem 
                            className="text-white"
                            onClick={() => handleEditTask(task)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit task
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-400"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add task button at bottom */}
        {filteredTasks.length > 0 && (
          <div className="mt-6">
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
              onClick={handleCreateTask}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add task
            </Button>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        mode={modalMode}
      />
    </div>
  )
}