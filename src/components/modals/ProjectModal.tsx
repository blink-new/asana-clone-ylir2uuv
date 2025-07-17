import { useState, useEffect } from 'react'
import { Calendar, Users, Target } from 'lucide-react'
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

interface Project {
  id?: string
  name: string
  description: string
  status: 'on-track' | 'at-risk' | 'off-track'
  dueDate: string
  color: string
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (project: Project) => void
  project?: Project | null
  mode: 'create' | 'edit'
}

const projectColors = [
  { name: 'Blue', value: 'bg-blue-500', hex: '#3b82f6' },
  { name: 'Green', value: 'bg-green-500', hex: '#22c55e' },
  { name: 'Purple', value: 'bg-purple-500', hex: '#a855f7' },
  { name: 'Red', value: 'bg-red-500', hex: '#ef4444' },
  { name: 'Orange', value: 'bg-orange-500', hex: '#f97316' },
  { name: 'Indigo', value: 'bg-indigo-500', hex: '#6366f1' },
  { name: 'Pink', value: 'bg-pink-500', hex: '#ec4899' },
  { name: 'Teal', value: 'bg-teal-500', hex: '#14b8a6' }
]

export function ProjectModal({ isOpen, onClose, onSave, project, mode }: ProjectModalProps) {
  const [formData, setFormData] = useState<Project>({
    name: '',
    description: '',
    status: 'on-track',
    dueDate: '',
    color: 'bg-blue-500'
  })

  useEffect(() => {
    if (project && mode === 'edit') {
      setFormData(project)
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'on-track',
        dueDate: '',
        color: 'bg-blue-500'
      })
    }
  }, [project, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const projectData = {
      ...formData,
      id: project?.id || `project_${Date.now()}`
    }

    onSave(projectData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2a2d30] border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === 'create' ? 'Create new project' : 'Edit project'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-300">
              Project name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name..."
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
              placeholder="Add project description..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 min-h-[100px]"
            />
          </div>

          {/* Due Date and Status Row */}
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
                <Target className="mr-2 h-4 w-4" />
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value: 'on-track' | 'at-risk' | 'off-track') => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="on-track" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      On track
                    </span>
                  </SelectItem>
                  <SelectItem value="at-risk" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      At risk
                    </span>
                  </SelectItem>
                  <SelectItem value="off-track" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Off track
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Project color</Label>
            <div className="grid grid-cols-8 gap-2">
              {projectColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-8 h-8 rounded-full ${color.value} border-2 ${
                    formData.color === color.value ? 'border-white' : 'border-transparent'
                  } hover:border-gray-300 transition-colors`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

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
              {mode === 'create' ? 'Create project' : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}