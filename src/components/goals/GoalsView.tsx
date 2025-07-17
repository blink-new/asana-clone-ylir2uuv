import { useState, useEffect } from 'react'
import { Plus, ChevronDown, Target, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GoalStrategyMap } from './GoalStrategyMap'
import { GoalDetailView } from './GoalDetailView'
import { TeamGoalsView } from './TeamGoalsView'
import { MyGoalsView } from './MyGoalsView'
import { GoalModal } from '@/components/modals/GoalModal'
import { useDatabase } from '@/hooks/useDatabase'
import { blink } from '@/blink/client'

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

const mockGoals: Goal[] = [
  {
    id: 'goal_1',
    title: 'Earn customer love',
    description: 'In the first half of this year we will be launching three products to allow our customers to work together more effectively.',
    status: 'achieved',
    progress: 100,
    targetValue: 100,
    currentValue: 100,
    unit: 'percentage',
    dueDate: '2024-12-31',
    ownerId: 'user_1',
    color: '#22c55e',
    collaborators: [
      { id: 'user_1', name: 'Neal Rads', avatar: 'NR', role: 'owner' },
      { id: 'user_2', name: 'Sarah Chen', avatar: 'SC', role: 'collaborator' },
      { id: 'user_3', name: 'Mike Johnson', avatar: 'MJ', role: 'collaborator' }
    ],
    connectedProjects: [
      { id: 'proj_1', name: 'CSAT Tracking', progress: 100 },
      { id: 'proj_2', name: 'NPS Global Roadmap', progress: 100 },
      { id: 'proj_3', name: 'Customer Marketing Initiatives', progress: 100 }
    ]
  },
  {
    id: 'goal_2',
    title: 'Win customer loyalty',
    description: 'Build strong relationships with our customer base through exceptional service and product quality.',
    status: 'active',
    progress: 75,
    targetValue: 100,
    currentValue: 75,
    unit: 'percentage',
    dueDate: '2024-06-30',
    ownerId: 'user_1',
    color: '#3b82f6',
    collaborators: [
      { id: 'user_1', name: 'Neal Rads', avatar: 'NR', role: 'owner' },
      { id: 'user_2', name: 'Sarah Chen', avatar: 'SC', role: 'collaborator' }
    ],
    connectedProjects: [
      { id: 'proj_4', name: 'Customer Retention Program', progress: 80 },
      { id: 'proj_5', name: 'Support Quality Improvement', progress: 70 }
    ]
  }
]

export function GoalsView() {
  const { goals, createGoal, updateGoal, deleteGoal, loading } = useDatabase()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('strategy-map')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const handleCreateGoal = () => {
    setSelectedGoal(null)
    setModalMode('create')
    setIsGoalModalOpen(true)
  }

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal)
    setModalMode('edit')
    setIsGoalModalOpen(true)
  }

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId)
  }

  const handleSaveGoal = async (goalData: any) => {
    if (!user?.id) return
    
    if (modalMode === 'create') {
      await createGoal({
        ...goalData,
        ownerId: user.id
      })
    } else {
      await updateGoal(goalData.id, goalData)
    }
  }

  // Use real goals data or fallback to mock data
  const displayGoals = goals.length > 0 ? goals : mockGoals

  if (selectedGoal) {
    return (
      <GoalDetailView 
        goal={selectedGoal} 
        onBack={() => setSelectedGoal(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">agdyna.com</h1>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="bg-transparent border-b border-gray-700 rounded-none h-auto p-0">
              <TabsTrigger 
                value="strategy-map" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white"
              >
                Strategy map
              </TabsTrigger>
              <TabsTrigger 
                value="company-goals" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white"
              >
                Company goals
              </TabsTrigger>
              <TabsTrigger 
                value="team-goals" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white"
              >
                Team goals
              </TabsTrigger>
              <TabsTrigger 
                value="my-goals" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-white"
              >
                My goals
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="strategy-map" className="mt-0">
            <GoalStrategyMap goals={displayGoals} onGoalSelect={setSelectedGoal} />
          </TabsContent>
          
          <TabsContent value="company-goals" className="mt-0">
            <div className="p-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-semibold mb-4">Set and achieve strategic goals</h2>
                <p className="text-gray-400 mb-8">
                  Add top-level goals to help teams prioritize and connect work to your organization's objectives.
                </p>
                
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleCreateGoal}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create goal
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>

                {/* Goals List */}
                <div className="mt-8 space-y-4">
                  {displayGoals.map((goal) => (
                    <Card 
                      key={goal.id} 
                      className="bg-[#2a2d30] border-gray-700 cursor-pointer hover:bg-[#3a3d40] transition-colors"
                      onClick={() => setSelectedGoal(goal)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                            <Target className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-medium text-white">{goal.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={goal.status === 'achieved' ? 'default' : 'secondary'}
                                  className={goal.status === 'achieved' ? 'bg-green-600' : 'bg-gray-600'}
                                >
                                  {goal.status === 'achieved' ? 'achieved' : 'active'}
                                </Badge>
                                <span className="text-sm text-gray-400">
                                  {goal.progress}% / {goal.targetValue}%
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{goal.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">Owned by</span>
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-gray-600 text-white text-xs">
                                    {goal.collaborators[0]?.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-white">{goal.collaborators[0]?.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">
                                  {goal.connectedProjects.length} connected projects
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="team-goals" className="mt-0">
            <TeamGoalsView />
          </TabsContent>
          
          <TabsContent value="my-goals" className="mt-0">
            <MyGoalsView />
          </TabsContent>
        </Tabs>
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        goal={selectedGoal}
        mode={modalMode}
      />
    </div>
  )
}