import { useState, useEffect } from 'react'
import { X, Calendar, User, Flag, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDatabase } from '@/hooks/useDatabase'

interface Task {
  id?: string
  title: string
  description?: string
  projectId?: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'completed' | 'blocked'
  assigneeId?: string
  tags?: string[]
}

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
  task?: Task | null
  mode: 'create' | 'edit'
}

const assignees = [
  'You',
  'Sarah',
  'Mike',
  'Alex',
  'Emma',
  'David',
  'Lisa',
  'Tom'
]

export function TaskModal({ isOpen, onClose, onSave, task, mode }: TaskModalProps) {
  const { projects } = useDatabase()
  
  const [formData, setFormData] = useState<Task>({
    title: '',
    description: '',
    projectId: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    assigneeId: 'You',
    tags: []
  })

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData(task)
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: '',
        dueDate: '',
        priority: 'medium',
        status: 'todo',
        assigneeId: 'You',
        tags: []
      })
    }
  }, [task, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const taskData = {
      ...formData,
      id: task?.id || `task_${Date.now()}`
    }

    onSave(taskData)
    onClose()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2a2d30] border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === 'create' ? 'Create new task' : 'Edit task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-300">
              Task name *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task name..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add task description..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 min-h-[100px]"
            />
          </div>

          {/* Project and Assignee Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300 flex items-center">
                <FolderOpen className="mr-2 h-4 w-4" />
                Project
              </Label>
              <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="" className="text-white hover:bg-gray-700">
                    No project
                  </SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="text-white hover:bg-gray-700">
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300 flex items-center">
                <User className="mr-2 h-4 w-4" />
                Assignee
              </Label>
              <Select value={formData.assigneeId} onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {assignees.map((assignee) => (
                    <SelectItem key={assignee} value={assignee} className="text-white hover:bg-gray-700">
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium text-gray-300 flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Due date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300 flex items-center">
                <Flag className="mr-2 h-4 w-4" />
                Priority
              </Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="urgent" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <Flag className="mr-2 h-4 w-4 text-red-600" />
                      Urgent
                    </span>
                  </SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <Flag className={`mr-2 h-4 w-4 ${getPriorityColor('high')}`} />
                      High Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <Flag className={`mr-2 h-4 w-4 ${getPriorityColor('medium')}`} />
                      Medium Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="low" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <Flag className={`mr-2 h-4 w-4 ${getPriorityColor('low')}`} />
                      Low Priority
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status (only for edit mode) */}
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'todo' | 'in_progress' | 'completed' | 'blocked') => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="todo" className="text-white hover:bg-gray-700">To Do</SelectItem>
                  <SelectItem value="in_progress" className="text-white hover:bg-gray-700">In Progress</SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-gray-700">Completed</SelectItem>
                  <SelectItem value="blocked" className="text-white hover:bg-gray-700">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {mode === 'create' ? 'Create task' : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}