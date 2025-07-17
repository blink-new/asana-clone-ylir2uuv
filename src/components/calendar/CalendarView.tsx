import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TaskModal } from '@/components/modals/TaskModal'
import { useDatabase } from '@/hooks/useDatabase'
import { blink } from '@/blink/client'

interface CalendarTask {
  id: string
  title: string
  dueDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'completed' | 'blocked'
  assigneeId?: string
  projectId?: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { tasks, createTask } = useDatabase()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return (tasks || []).filter(task => 
      task.dueDate && task.dueDate.startsWith(dateStr)
    )
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSameMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600'
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleCreateTask = () => {
    setIsTaskModalOpen(true)
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

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0)
    const prevMonthDays = prevMonth.getDate()
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i)
      const dayTasks = getTasksForDate(date)
      
      days.push(
        <div
          key={`prev-${prevMonthDays - i}`}
          className="min-h-[120px] p-2 border border-gray-700 bg-gray-800/50 cursor-pointer hover:bg-gray-700/50 transition-colors"
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm text-gray-500 mb-1">{prevMonthDays - i}</div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded truncate ${getPriorityColor(task.priority)} text-white`}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-xs text-gray-400">+{dayTasks.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayTasks = getTasksForDate(date)
      const isCurrentDay = isToday(date)
      
      days.push(
        <div
          key={day}
          className={`min-h-[120px] p-2 border border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors ${
            isCurrentDay ? 'bg-blue-900/30 border-blue-500' : 'bg-[#2a2d30]'
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm mb-1 ${isCurrentDay ? 'text-blue-400 font-semibold' : 'text-white'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded truncate ${getPriorityColor(task.priority)} text-white`}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-xs text-gray-400">+{dayTasks.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }

    // Next month's leading days
    const totalCells = 42 // 6 rows × 7 days
    const remainingCells = totalCells - days.length
    
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
      const dayTasks = getTasksForDate(date)
      
      days.push(
        <div
          key={`next-${day}`}
          className="min-h-[120px] p-2 border border-gray-700 bg-gray-800/50 cursor-pointer hover:bg-gray-700/50 transition-colors"
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm text-gray-500 mb-1">{day}</div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded truncate ${getPriorityColor(task.priority)} text-white`}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-xs text-gray-400">+{dayTasks.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <CalendarIcon className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-semibold text-white">Calendar</h1>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreateTask}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add task
            </Button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-gray-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-white">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-gray-400 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
            >
              Today
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Calendar Grid */}
        <div className="flex-1 p-6">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {DAYS.map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-400 border-b border-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-700">
            {renderCalendarGrid()}
          </div>
        </div>

        {/* Sidebar */}
        {selectedDate && (
          <div className="w-80 border-l border-gray-700 bg-[#2a2d30]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>

              {selectedDateTasks.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Tasks ({selectedDateTasks.length})
                  </h4>
                  {selectedDateTasks.map(task => (
                    <Card key={task.id} className="bg-[#3a3d40] border-gray-600">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-white text-sm">{task.title}</h5>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              task.priority === 'urgent' ? 'bg-red-600 text-white' :
                              task.priority === 'high' ? 'bg-red-500 text-white' :
                              task.priority === 'medium' ? 'bg-yellow-500 text-white' :
                              'bg-green-500 text-white'
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Due today</span>
                          </div>
                          {task.assigneeId && (
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-4 w-4">
                                <AvatarFallback className="bg-purple-600 text-white text-xs">
                                  {task.assigneeId.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">No tasks scheduled for this day</p>
                  <Button
                    size="sm"
                    onClick={handleCreateTask}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add task
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={null}
        mode="create"
      />
    </div>
  )
}