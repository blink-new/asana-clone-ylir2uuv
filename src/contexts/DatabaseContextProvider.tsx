import React, { useState, useEffect, useCallback, ReactNode } from 'react'
import { blink } from '@/blink/client'
import { Project, Task, Team, Comment, Goal } from '@/lib/database'
import { DatabaseContext } from './DatabaseContext'

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState({
    projects: true,
    tasks: true,
    teams: true,
    goals: true
  })

  // Projects
  const refreshProjects = useCallback(async () => {
    if (!user?.id) return
    
    setLoading(prev => ({ ...prev, projects: true }))
    try {
      const data = await blink.db.projects.list({
        where: { owner_id: user.id },
        orderBy: { updated_at: 'desc' }
      })
      
      const userProjects = (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        color: p.color,
        status: p.status,
        ownerId: p.owner_id,
        teamId: p.team_id,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        dueDate: p.due_date,
        progress: p.progress
      }))
      
      setProjects(userProjects)
    } catch (error) {
      console.error('Error refreshing projects:', error)
      setProjects([])
    } finally {
      setLoading(prev => ({ ...prev, projects: false }))
    }
  }, [user?.id])

  // Tasks
  const refreshTasks = useCallback(async () => {
    if (!user?.id) return
    
    setLoading(prev => ({ ...prev, tasks: true }))
    try {
      const data = await blink.db.tasks.list({
        orderBy: { updated_at: 'desc' }
      })
      
      const userTasks = (data || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        projectId: t.project_id,
        assigneeId: t.assignee_id,
        creatorId: t.created_by,
        status: t.status,
        priority: t.priority,
        dueDate: t.due_date,
        completedAt: t.completed_at,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        parentTaskId: t.parent_task_id,
        estimatedHours: 0,
        actualHours: 0,
        tags: []
      }))
      
      setTasks(userTasks)
    } catch (error) {
      console.error('Error refreshing tasks:', error)
      setTasks([])
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }))
    }
  }, [user?.id])

  // Teams
  const refreshTeams = useCallback(async () => {
    if (!user?.id) return
    
    setLoading(prev => ({ ...prev, teams: true }))
    try {
      const data = await blink.db.teams.list({
        where: { owner_id: user.id },
        orderBy: { updated_at: 'desc' }
      })
      
      const userTeams = (data || []).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        ownerId: t.owner_id,
        createdAt: t.created_at,
        updatedAt: t.updated_at
      }))
      
      setTeams(userTeams)
    } catch (error) {
      console.error('Error refreshing teams:', error)
      setTeams([])
    } finally {
      setLoading(prev => ({ ...prev, teams: false }))
    }
  }, [user?.id])

  // Goals
  const refreshGoals = useCallback(async () => {
    if (!user?.id) return
    
    setLoading(prev => ({ ...prev, goals: true }))
    try {
      const data = await blink.db.goals.list({
        where: { owner_id: user.id },
        orderBy: { updated_at: 'desc' }
      })
      
      const userGoals = (data || []).map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        targetValue: 100,
        currentValue: g.progress || 0,
        unit: '%',
        dueDate: g.due_date,
        status: g.status,
        color: '#f06a6a',
        ownerId: g.owner_id,
        teamId: g.team_id,
        createdAt: g.created_at,
        updatedAt: g.updated_at
      }))
      
      setGoals(userGoals)
    } catch (error) {
      console.error('Error refreshing goals:', error)
      setGoals([])
    } finally {
      setLoading(prev => ({ ...prev, goals: false }))
    }
  }, [user?.id])

  // Auth state listener - using Blink auth
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      if (state.user && !state.isLoading) {
        // Load data when user is authenticated
        refreshProjects()
        refreshTasks()
        refreshTeams()
        refreshGoals()
      } else if (!state.user) {
        // Clear data when user logs out
        setProjects([])
        setTasks([])
        setTeams([])
        setGoals([])
      }
    })

    return unsubscribe
  }, [refreshProjects, refreshTasks, refreshTeams, refreshGoals])

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProject = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

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
        progress: newProject.progress
      })

      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
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
        const data = projects[0]
        const updatedProject = {
          id: data.id,
          name: data.name,
          description: data.description,
          color: data.color,
          status: data.status,
          ownerId: data.owner_id,
          teamId: data.team_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          dueDate: data.due_date,
          progress: data.progress
        }
        
        setProjects(prev => prev.map(p => p.id === id ? updatedProject : p))
        return updatedProject
      }
      return null
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await blink.db.projects.delete(id)

      setProjects(prev => prev.filter(p => p.id !== id))
      // Also remove tasks associated with this project
      setTasks(prev => prev.filter(t => t.projectId !== id))
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      return false
    }
  }

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

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
        parent_task_id: newTask.parentTaskId || null
      })

      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
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
        const data = tasks[0]
        const updatedTask = {
          id: data.id,
          title: data.title,
          description: data.description,
          projectId: data.project_id,
          assigneeId: data.assignee_id,
          creatorId: data.created_by,
          status: data.status,
          priority: data.priority,
          dueDate: data.due_date,
          completedAt: data.completed_at,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          parentTaskId: data.parent_task_id,
          estimatedHours: 0,
          actualHours: 0,
          tags: []
        }
        
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
        return updatedTask
      }
      return null
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await blink.db.tasks.delete(id)

      setTasks(prev => prev.filter(t => t.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting task:', error)
      return false
    }
  }

  const getTasksByProject = (projectId: string) => {
    return (tasks || []).filter(task => task.projectId === projectId)
  }

  const getTasksByAssignee = (assigneeId: string) => {
    return (tasks || []).filter(task => task.assigneeId === assigneeId)
  }

  const createTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTeam = {
        id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...teamData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await blink.db.teams.create({
        id: newTeam.id,
        name: newTeam.name,
        description: newTeam.description || '',
        owner_id: newTeam.ownerId,
        created_at: newTeam.createdAt,
        updated_at: newTeam.updatedAt
      })

      setTeams(prev => [newTeam, ...prev])
      return newTeam
    } catch (error) {
      console.error('Error creating team:', error)
      throw error
    }
  }

  const createGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newGoal = {
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...goalData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

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
        updated_at: newGoal.updatedAt
      })

      setGoals(prev => [newGoal, ...prev])
      return newGoal
    } catch (error) {
      console.error('Error creating goal:', error)
      throw error
    }
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
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
        const data = goals[0]
        const updatedGoal = {
          id: data.id,
          title: data.title,
          description: data.description,
          targetValue: 100,
          currentValue: data.progress || 0,
          unit: '%',
          dueDate: data.due_date,
          status: data.status,
          color: '#f06a6a',
          ownerId: data.owner_id,
          teamId: data.team_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
        
        setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g))
        return updatedGoal
      }
      return null
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      await blink.db.goals.delete(id)

      setGoals(prev => prev.filter(g => g.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting goal:', error)
      return false
    }
  }

  // Comments
  const getComments = async (taskId: string) => {
    try {
      const data = await blink.db.task_comments.list({
        where: { task_id: taskId },
        orderBy: { created_at: 'asc' }
      })

      return (data || []).map(c => ({
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

  const createComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newComment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...commentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

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

  const value = {
    // Projects
    projects,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,

    // Tasks
    tasks,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    getTasksByProject,
    getTasksByAssignee,

    // Teams
    teams,
    createTeam,
    refreshTeams,

    // Goals
    goals,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals,

    // Comments
    getComments,
    createComment,

    // Loading states
    loading
  }

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  )
}