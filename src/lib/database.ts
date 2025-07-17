import { blink } from '@/blink/client'

// Database types
export interface Project {
  id: string
  name: string
  description?: string
  color: string
  status: 'active' | 'archived' | 'completed'
  ownerId: string
  teamId?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  progress: number
}

export interface Task {
  id: string
  title: string
  description?: string
  projectId?: string
  assigneeId?: string
  creatorId: string
  status: 'todo' | 'in_progress' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  parentTaskId?: string
  estimatedHours?: number
  actualHours?: number
  tags?: string[]
}

export interface Team {
  id: string
  name: string
  description?: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

export interface Comment {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
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
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  userId: string
  action: string
  entityType: 'task' | 'project' | 'goal' | 'comment'
  entityId: string
  details?: any
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  readStatus: boolean
  entityType?: string
  entityId?: string
  createdAt: string
}

// Database service class using Blink SDK
export class DatabaseService {
  // Projects
  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const user = await blink.auth.me()
    if (!user) throw new Error('User not authenticated')

    const newProject: Project = {
      ...project,
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    try {
      // Create project record with user_id for Blink SDK
      await blink.db.projects.create({
        id: newProject.id,
        name: newProject.name,
        description: newProject.description || '',
        color: newProject.color,
        status: newProject.status,
        owner_id: newProject.ownerId,
        team_id: newProject.teamId || null,
        created_at: newProject.createdAt,
        updated_at: newProject.updatedAt,
        due_date: newProject.dueDate || null,
        progress: newProject.progress,
        user_id: user.id
      })

      return newProject
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  async getProjects(userId: string): Promise<Project[]> {
    try {
      const data = await blink.db.projects.list({
        where: { owner_id: userId },
        orderBy: { updated_at: 'desc' }
      })

      return data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        color: p.color,
        status: p.status as 'active' | 'archived' | 'completed',
        ownerId: p.owner_id,
        teamId: p.team_id,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        dueDate: p.due_date,
        progress: p.progress
      }))
    } catch (error) {
      console.error('Error fetching projects:', error)
      return []
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      if (updates.name) updateData.name = updates.name
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.color) updateData.color = updates.color
      if (updates.status) updateData.status = updates.status
      if (updates.teamId !== undefined) updateData.team_id = updates.teamId
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate
      if (updates.progress !== undefined) updateData.progress = updates.progress

      await blink.db.projects.update(id, updateData)
      
      // Return updated project by fetching it
      const projects = await blink.db.projects.list({
        where: { id }
      })
      
      if (projects.length > 0) {
        const p = projects[0]
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          color: p.color,
          status: p.status as 'active' | 'archived' | 'completed',
          ownerId: p.owner_id,
          teamId: p.team_id,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          dueDate: p.due_date,
          progress: p.progress
        }
      }
      return null
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      await blink.db.projects.delete(id)
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      return false
    }
  }

  // Tasks
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const user = await blink.auth.me()
    if (!user) throw new Error('User not authenticated')

    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    try {
      await blink.db.tasks.create({
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || '',
        project_id: newTask.projectId || null,
        assignee_id: newTask.assigneeId || null,
        created_by: newTask.creatorId,
        status: newTask.status,
        priority: newTask.priority,
        due_date: newTask.dueDate || null,
        completed_at: newTask.completedAt || null,
        created_at: newTask.createdAt,
        updated_at: newTask.updatedAt,
        parent_task_id: newTask.parentTaskId || null,
        user_id: user.id
      })

      return newTask
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  async getTasks(filters?: { projectId?: string; assigneeId?: string; status?: string }): Promise<Task[]> {
    try {
      const whereClause: any = {}

      if (filters?.projectId) {
        whereClause.project_id = filters.projectId
      }
      if (filters?.assigneeId) {
        whereClause.assignee_id = filters.assigneeId
      }
      if (filters?.status) {
        whereClause.status = filters.status
      }

      const data = await blink.db.tasks.list({
        where: whereClause,
        orderBy: { updated_at: 'desc' }
      })

      return data.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        projectId: t.project_id,
        assigneeId: t.assignee_id,
        creatorId: t.created_by,
        status: t.status as 'todo' | 'in_progress' | 'completed' | 'blocked',
        priority: t.priority as 'low' | 'medium' | 'high' | 'urgent',
        dueDate: t.due_date,
        completedAt: t.completed_at,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        parentTaskId: t.parent_task_id,
        estimatedHours: 0,
        actualHours: 0,
        tags: []
      }))
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      if (updates.title) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.status) updateData.status = updates.status
      if (updates.priority) updateData.priority = updates.priority
      if (updates.assigneeId !== undefined) updateData.assignee_id = updates.assigneeId
      if (updates.projectId !== undefined) updateData.project_id = updates.projectId
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt
      if (updates.parentTaskId !== undefined) updateData.parent_task_id = updates.parentTaskId

      await blink.db.tasks.update(id, updateData)
      
      // Return updated task by fetching it
      const tasks = await blink.db.tasks.list({
        where: { id }
      })
      
      if (tasks.length > 0) {
        const t = tasks[0]
        return {
          id: t.id,
          title: t.title,
          description: t.description,
          projectId: t.project_id,
          assigneeId: t.assignee_id,
          creatorId: t.created_by,
          status: t.status as 'todo' | 'in_progress' | 'completed' | 'blocked',
          priority: t.priority as 'low' | 'medium' | 'high' | 'urgent',
          dueDate: t.due_date,
          completedAt: t.completed_at,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
          parentTaskId: t.parent_task_id,
          estimatedHours: 0,
          actualHours: 0,
          tags: []
        }
      }
      return null
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      await blink.db.tasks.delete(id)
      return true
    } catch (error) {
      console.error('Error deleting task:', error)
      return false
    }
  }

  // Teams
  async createTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
    const user = await blink.auth.me()
    if (!user) throw new Error('User not authenticated')

    const newTeam: Team = {
      ...team,
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    try {
      await blink.db.teams.create({
        id: newTeam.id,
        name: newTeam.name,
        description: newTeam.description || '',
        owner_id: newTeam.ownerId,
        created_at: newTeam.createdAt,
        updated_at: newTeam.updatedAt,
        user_id: user.id
      })

      return newTeam
    } catch (error) {
      console.error('Error creating team:', error)
      throw error
    }
  }

  async getTeams(userId: string): Promise<Team[]> {
    try {
      const data = await blink.db.teams.list({
        where: { owner_id: userId },
        orderBy: { updated_at: 'desc' }
      })

      return data.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        ownerId: t.owner_id,
        createdAt: t.created_at,
        updatedAt: t.updated_at
      }))
    } catch (error) {
      console.error('Error fetching teams:', error)
      return []
    }
  }

  // Goals
  async createGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    const user = await blink.auth.me()
    if (!user) throw new Error('User not authenticated')

    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    try {
      await blink.db.goals.create({
        id: newGoal.id,
        title: newGoal.title,
        description: newGoal.description || '',
        progress: newGoal.currentValue,
        due_date: newGoal.dueDate || null,
        status: newGoal.status,
        owner_id: newGoal.ownerId,
        team_id: newGoal.teamId || null,
        created_at: newGoal.createdAt,
        updated_at: newGoal.updatedAt,
        user_id: user.id
      })

      return newGoal
    } catch (error) {
      console.error('Error creating goal:', error)
      throw error
    }
  }

  async getGoals(userId: string): Promise<Goal[]> {
    try {
      const data = await blink.db.goals.list({
        where: { owner_id: userId },
        orderBy: { updated_at: 'desc' }
      })

      return data.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        targetValue: 100,
        currentValue: g.progress || 0,
        unit: '%',
        dueDate: g.due_date,
        status: g.status as 'active' | 'achieved' | 'on_hold' | 'cancelled',
        color: '#f06a6a',
        ownerId: g.owner_id,
        teamId: g.team_id,
        createdAt: g.created_at,
        updatedAt: g.updated_at
      }))
    } catch (error) {
      console.error('Error fetching goals:', error)
      return []
    }
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | null> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      if (updates.title) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.status) updateData.status = updates.status
      if (updates.currentValue !== undefined) updateData.progress = updates.currentValue
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate
      if (updates.teamId !== undefined) updateData.team_id = updates.teamId

      await blink.db.goals.update(id, updateData)
      
      // Return updated goal by fetching it
      const goals = await blink.db.goals.list({
        where: { id }
      })
      
      if (goals.length > 0) {
        const g = goals[0]
        return {
          id: g.id,
          title: g.title,
          description: g.description,
          targetValue: 100,
          currentValue: g.progress || 0,
          unit: '%',
          dueDate: g.due_date,
          status: g.status as 'active' | 'achieved' | 'on_hold' | 'cancelled',
          color: '#f06a6a',
          ownerId: g.owner_id,
          teamId: g.team_id,
          createdAt: g.created_at,
          updatedAt: g.updated_at
        }
      }
      return null
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  }

  async deleteGoal(id: string): Promise<boolean> {
    try {
      await blink.db.goals.delete(id)
      return true
    } catch (error) {
      console.error('Error deleting goal:', error)
      return false
    }
  }

  // Comments
  async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    try {
      await blink.db.task_comments.create({
        id: newComment.id,
        task_id: newComment.taskId,
        user_id: newComment.userId,
        content: newComment.content,
        created_at: newComment.createdAt
      })

      return newComment
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  }

  async getComments(taskId: string): Promise<Comment[]> {
    try {
      const data = await blink.db.task_comments.list({
        where: { task_id: taskId },
        orderBy: { created_at: 'asc' }
      })

      return data.map(c => ({
        id: c.id,
        taskId: c.task_id,
        userId: c.user_id,
        content: c.content,
        createdAt: c.created_at,
        updatedAt: c.created_at
      }))
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  }
}

// Export singleton instance
export const db = new DatabaseService()