import { createContext } from 'react'
import { DatabaseContextType } from './DatabaseContextType'

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)