import { useState, useEffect } from 'react'
import { Target, Calendar, Users, TrendingUp } from 'lucide-react'
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
import { Progress } from '@/components/ui/progress'
import { useDatabase } from '@/hooks/useDatabase'

interface Goal {
  id?: string
  title: string
  description?: string
  targetValue: number
  currentValue: number
  unit: string
  dueDate?: string
  status: 'active' | 'achieved' | 'on_hold' | 'cancelled'
  color: string
  ownerId: string
  teamId?: string
}

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (goal: Goal) => void
  goal?: Goal | null
  mode: 'create' | 'edit'
}

const goalColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Teal', value: '#14b8a6' }
]

const unitOptions = [
  { label: 'Percentage (%)', value: 'percentage' },
  { label: 'Number', value: 'number' },
  { label: 'Currency ($)', value: 'currency' },
  { label: 'Hours', value: 'hours' },
  { label: 'Days', value: 'days' },
  { label: 'Users', value: 'users' },
  { label: 'Projects', value: 'projects' }
]

export function GoalModal({ isOpen, onClose, onSave, goal, mode }: GoalModalProps) {
  const { teams } = useDatabase()
  
  const [formData, setFormData] = useState<Goal>({
    title: '',
    description: '',
    targetValue: 100,
    currentValue: 0,
    unit: 'percentage',
    dueDate: '',
    status: 'active',
    color: '#3b82f6',
    ownerId: '',
    teamId: ''
  })

  useEffect(() => {
    if (goal && mode === 'edit') {
      setFormData(goal)
    } else {
      setFormData({
        title: '',
        description: '',
        targetValue: 100,
        currentValue: 0,
        unit: 'percentage',
        dueDate: '',
        status: 'active',
        color: '#3b82f6',
        ownerId: '',
        teamId: ''
      })
    }
  }, [goal, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const goalData = {
      ...formData,
      id: goal?.id || `goal_${Date.now()}`
    }

    onSave(goalData)
    onClose()
  }

  const progress = formData.targetValue > 0 ? (formData.currentValue / formData.targetValue) * 100 : 0

  const getUnitSymbol = (unit: string) => {
    switch (unit) {
      case 'percentage': return '%'
      case 'currency': return '$'
      case 'hours': return 'hrs'
      case 'days': return 'days'
      case 'users': return 'users'
      case 'projects': return 'projects'
      default: return ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2a2d30] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            <Target className="mr-2 h-5 w-5" />
            {mode === 'create' ? 'Create new goal' : 'Edit goal'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-300">
              Goal title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter goal title..."
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
              placeholder="Describe what success looks like for this goal..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 min-h-[100px]"
            />
          </div>

          {/* Target and Current Values */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {unitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue" className="text-sm font-medium text-gray-300">
                Current value
              </Label>
              <div className="relative">
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 pr-12"
                  min="0"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  {getUnitSymbol(formData.unit)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetValue" className="text-sm font-medium text-gray-300">
                Target value *
              </Label>
              <div className="relative">
                <Input
                  id="targetValue"
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 pr-12"
                  min="1"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  {getUnitSymbol(formData.unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-300">Progress</Label>
              <span className="text-sm text-gray-400">
                {Math.round(progress)}% ({formData.currentValue} / {formData.targetValue} {getUnitSymbol(formData.unit)})
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Due Date and Team */}
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
                <Users className="mr-2 h-4 w-4" />
                Team
              </Label>
              <Select value={formData.teamId} onValueChange={(value) => setFormData({ ...formData, teamId: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="" className="text-white hover:bg-gray-700">
                    No team
                  </SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id} className="text-white hover:bg-gray-700">
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status (only for edit mode) */}
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300 flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'achieved' | 'on_hold' | 'cancelled') => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="active" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Active
                    </span>
                  </SelectItem>
                  <SelectItem value="achieved" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Achieved
                    </span>
                  </SelectItem>
                  <SelectItem value="on_hold" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      On Hold
                    </span>
                  </SelectItem>
                  <SelectItem value="cancelled" className="text-white hover:bg-gray-700">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Cancelled
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Goal color</Label>
            <div className="grid grid-cols-8 gap-2">
              {goalColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color.value ? 'border-white' : 'border-transparent'
                  } hover:border-gray-300 transition-colors`}
                  style={{ backgroundColor: color.value }}
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
              {mode === 'create' ? 'Create goal' : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}