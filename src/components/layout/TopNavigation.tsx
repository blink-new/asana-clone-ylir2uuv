import { Search, Bell, Settings, HelpCircle, User, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { blink } from '@/blink/client'

export function TopNavigation() {
  return (
    <header className="h-14 bg-[#1d1f21] border-b border-gray-700 flex items-center justify-between px-4">
      {/* Left side - Menu and Search */}
      <div className="flex items-center space-x-4 flex-1">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🏗️</span>
          </div>
          <span className="font-semibold text-lg text-white">Workbarn</span>
        </div>
        
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search Workbarn"
            className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700 focus:border-gray-500"
          />
        </div>
      </div>

      {/* Right side - Actions and Profile */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <HelpCircle className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" className="relative text-gray-400 hover:text-white">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-purple-600 text-white text-xs">AY</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="text-red-400 hover:bg-gray-700"
              onClick={() => blink.auth.logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}