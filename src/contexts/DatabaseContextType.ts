import { Project, Task, Team, Comment, Goal } from '@/lib/database'

export interface DatabaseContextType {
  // Projects
  projects: Project[]
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project | null>
  deleteProject: (id: string) => Promise<boolean>
  refreshProjects: () => Promise<void>

  // Tasks
  tasks: Task[]
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | null>
  deleteTask: (id: string) => Promise<boolean>
  refreshTasks: () => Promise<void>
  getTasksByProject: (projectId: string) => Task[]
  getTasksByAssignee: (assigneeId: string) => Task[]

  // Teams
  teams: Team[]
  createTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Team>
  refreshTeams: () => Promise<void>

  // Goals
  goals: Goal[]
  createGoal: (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Goal>
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<Goal | null>
  deleteGoal: (id: string) => Promise<boolean>
  refreshGoals: () => Promise<void>

  // Comments
  getComments: (taskId: string) => Promise<Comment[]>
  createComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Comment>

  // Loading states
  loading: {
    projects: boolean
    tasks: boolean
    teams: boolean
    goals: boolean
  }
}