import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { DatabaseProvider } from './contexts/DatabaseContextProvider'
import { TopNavigation } from './components/layout/TopNavigation'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { TasksView } from './components/tasks/TasksView'
import { ProjectsView } from './components/projects/ProjectsView'
import { InboxView } from './components/inbox/InboxView'
import { ReportingView } from './components/reporting/ReportingView'
import { PortfoliosView } from './components/portfolios/PortfoliosView'
import { GoalsView } from './components/goals/GoalsView'
import { CalendarView } from './components/calendar/CalendarView'
import { TeamsView } from './components/teams/TeamsView'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    // Listen to Blink auth state changes
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'tasks':
        return <TasksView />
      case 'projects':
        return <ProjectsView />
      case 'inbox':
        return <InboxView />
      case 'reporting':
        return <ReportingView />
      case 'portfolios':
        return <PortfoliosView />
      case 'teams':
        return <TeamsView />
      case 'goals':
        return <GoalsView />
      case 'calendar':
        return <CalendarView />
      default:
        return <Dashboard />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-[#f06a6a] rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#f06a6a] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">W</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Workbarn</h1>
            <p className="text-gray-600 mb-6">
              Sign in to access your workspace
            </p>
            <button
              onClick={() => blink.auth.login()}
              className="w-full bg-[#f06a6a] hover:bg-[#e55a5a] text-white py-3 px-4 rounded-md font-medium transition-colors"
            >
              Sign In with Blink
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DatabaseProvider>
      <div className="min-h-screen bg-[#fafbfc] flex flex-col">
        <TopNavigation />
        <div className="flex flex-1">
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </DatabaseProvider>
  )
}

export default App