import { useState, useEffect } from 'react'
import { Plus, Users, Settings, MoreHorizontal, Crown, Shield, User, Mail, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDatabase } from '@/hooks/useDatabase'
import { blink } from '@/blink/client'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  avatar?: string
  joinedAt: string
  lastActive: string
}

interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  members: TeamMember[]
  createdAt: string
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Product Team',
    description: 'Core product development and strategy',
    memberCount: 8,
    members: [
      {
        id: '1',
        name: 'You',
        email: 'you@company.com',
        role: 'owner',
        joinedAt: '2024-01-01',
        lastActive: '2024-01-17'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'admin',
        joinedAt: '2024-01-02',
        lastActive: '2024-01-17'
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@company.com',
        role: 'member',
        joinedAt: '2024-01-05',
        lastActive: '2024-01-16'
      }
    ],
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Marketing Team',
    description: 'Brand, content, and growth marketing',
    memberCount: 5,
    members: [
      {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma@company.com',
        role: 'owner',
        joinedAt: '2024-01-03',
        lastActive: '2024-01-17'
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david@company.com',
        role: 'member',
        joinedAt: '2024-01-08',
        lastActive: '2024-01-15'
      }
    ],
    createdAt: '2024-01-03'
  }
]

export function TeamsView() {
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)
  const { createTeam } = useDatabase()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />
      default: return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Owner</Badge>
      case 'admin': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Admin</Badge>
      default: return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Member</Badge>
    }
  }

  const handleCreateTeam = async () => {
    if (!user?.id) return
    
    const newTeam = {
      name: 'New Team',
      description: 'Team description',
      ownerId: user.id
    }
    
    try {
      await createTeam(newTeam)
      // Refresh teams list
    } catch (error) {
      console.error('Error creating team:', error)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (selectedTeam) {
    return (
      <div className="min-h-screen bg-[#1d1f21] text-white">
        {/* Team Header */}
        <div className="border-b border-gray-700 bg-[#1d1f21]">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTeam(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back to Teams
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold text-white">{selectedTeam.name}</h1>
                  <p className="text-gray-400">{selectedTeam.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Invite members
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Team Members ({selectedTeam.memberCount})
            </h2>
            
            <div className="grid gap-4">
              {selectedTeam.members.map(member => (
                <Card key={member.id} className="bg-[#2a2d30] border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-purple-600 text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-white">{member.name}</h3>
                            {getRoleIcon(member.role)}
                          </div>
                          <p className="text-sm text-gray-400">{member.email}</p>
                          <p className="text-xs text-gray-500">
                            Last active: {new Date(member.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getRoleBadge(member.role)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem className="text-white">View profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-white">Change role</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400">Remove from team</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1d1f21] text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-[#1d1f21]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-semibold text-white">Teams</h1>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreateTeam}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create team
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700 focus:border-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="p-6">
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              {searchQuery ? 'No teams found' : 'No teams yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Create your first team to start collaborating with your colleagues'
              }
            </p>
            {!searchQuery && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCreateTeam}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create your first team
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map(team => (
              <Card 
                key={team.id} 
                className="bg-[#2a2d30] border-gray-700 hover:bg-[#3a3d40] transition-colors cursor-pointer"
                onClick={() => setSelectedTeam(team)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-white">{team.name}</CardTitle>
                        <p className="text-sm text-gray-400 mt-1">{team.description}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-white">Edit team</DropdownMenuItem>
                        <DropdownMenuItem className="text-white">Team settings</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">Delete team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Members</span>
                    <span className="font-medium text-white">{team.memberCount}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 4).map((member, index) => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-[#2a2d30]">
                          <AvatarFallback className="bg-purple-600 text-white text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {team.memberCount > 4 && (
                        <div className="h-8 w-8 bg-gray-600 rounded-full border-2 border-[#2a2d30] flex items-center justify-center">
                          <span className="text-xs text-white">+{team.memberCount - 4}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      Created {new Date(team.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}