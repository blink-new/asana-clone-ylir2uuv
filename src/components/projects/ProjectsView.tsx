import { useState } from 'react'
import { Plus, Grid3X3, List, Calendar, Users, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectModal } from '@/components/modals/ProjectModal'

interface Project {
  id: string
  name: string
  description: string
  progress: number
  totalTasks: number
  completedTasks: number
  dueDate: string
  status: 'on-track' | 'at-risk' | 'off-track'
  team: string[]
  color: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with new branding and improved UX',
    progress: 75,
    totalTasks: 24,
    completedTasks: 18,
    dueDate: '2024-02-15',
    status: 'on-track',
    team: ['You', 'Sarah', 'Mike', 'Alex'],
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Q1 Marketing Campaign',
    description: 'Launch comprehensive marketing campaign for Q1 product releases',
    progress: 45,
    totalTasks: 16,
    completedTasks: 7,
    dueDate: '2024-01-31',
    status: 'at-risk',
    team: ['Sarah', 'Emma', 'David'],
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'Product Launch',
    description: 'Coordinate launch activities for new product line',
    progress: 90,
    totalTasks: 20,
    completedTasks: 18,
    dueDate: '2024-01-25',
    status: 'on-track',
    team: ['Mike', 'Lisa', 'Tom', 'You'],
    color: 'bg-purple-500'
  },
  {
    id: '4',
    name: 'User Research Study',
    description: 'Conduct comprehensive user research for product improvements',
    progress: 20,
    totalTasks: 12,
    completedTasks: 2,
    dueDate: '2024-03-01',
    status: 'off-track',
    team: ['Emma', 'You'],
    color: 'bg-orange-500'
  },
  {
    id: '5',
    name: 'Mobile App Development',
    description: 'Develop iOS and Android mobile applications',
    progress: 60,
    totalTasks: 32,
    completedTasks: 19,
    dueDate: '2024-04-15',
    status: 'on-track',
    team: ['Alex', 'Tom', 'Lisa', 'David'],
    color: 'bg-red-500'
  },
  {
    id: '6',
    name: 'Customer Support Portal',
    description: 'Build self-service customer support portal',
    progress: 35,
    totalTasks: 18,
    completedTasks: 6,
    dueDate: '2024-02-28',
    status: 'at-risk',
    team: ['Mike', 'Sarah'],
    color: 'bg-indigo-500'
  }
]

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800'
      case 'at-risk': return 'bg-yellow-100 text-yellow-800'
      case 'off-track': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-track': return 'On track'
      case 'at-risk': return 'At risk'
      case 'off-track': return 'Off track'
      default: return 'Unknown'
    }
  }

  const handleCreateProject = () => {
    setSelectedProject(null)
    setModalMode('create')
    setIsProjectModalOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setModalMode('edit')
    setIsProjectModalOpen(true)
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId))
  }

  const handleSaveProject = (projectData: Project) => {
    if (modalMode === 'create') {
      setProjects([...projects, projectData])
    } else {
      setProjects(projects.map(project => project.id === projectData.id ? projectData : project))
    }
  }

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="bg-[#2a2d30] border-gray-700 hover:bg-[#3a3d40] transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded ${project.color}`}></div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">{project.name}</CardTitle>
              <p className="text-sm text-gray-400 mt-1">{project.description}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuItem 
                className="text-white"
                onClick={() => handleEditProject(project)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit project
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white">Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-white">Archive</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-400"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-medium text-white">{project.completedTasks}/{project.totalTasks} tasks</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          <p className="text-xs text-gray-500">{project.progress}% complete</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Due {project.dueDate}</span>
          </div>
          <Badge variant="outline" className={getStatusColor(project.status)}>
            {getStatusText(project.status)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">{project.team.length} members</span>
          </div>
          <div className="flex -space-x-2">
            {project.team.slice(0, 4).map((member, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-white">
                <AvatarFallback className="text-xs">{member.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.team.length > 4 && (
              <div className="h-6 w-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{project.team.length - 4}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ProjectListItem = ({ project }: { project: Project }) => (
    <Card className="bg-[#2a2d30] border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-4 h-4 rounded ${project.color}`}></div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{project.name}</h3>
              <p className="text-sm text-gray-400">{project.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-sm font-medium text-white">{project.progress}%</p>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-white">{project.completedTasks}/{project.totalTasks}</p>
              <p className="text-xs text-gray-500">Tasks</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-white">{project.dueDate}</p>
              <p className="text-xs text-gray-500">Due date</p>
            </div>
            
            <Badge variant="outline" className={getStatusColor(project.status)}>
              {getStatusText(project.status)}
            </Badge>
            
            <div className="flex -space-x-2">
              {project.team.slice(0, 3).map((member, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="text-xs">{member.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem 
                  className="text-white"
                  onClick={() => handleEditProject(project)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit project
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white">Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-white">Archive</DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-400"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">{projects.length} projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCreateProject}
          >
            <Plus className="mr-2 h-4 w-4" />
            New project
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </div>
      )}
      
      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        project={selectedProject}
        mode={modalMode}
      />
    </div>
  )
}