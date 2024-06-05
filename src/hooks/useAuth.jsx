import { useContext } from 'react'
import AuthContext from '../utils/AuthContext'

export const useAuth = () => {
  return useContext(AuthContext)
}
