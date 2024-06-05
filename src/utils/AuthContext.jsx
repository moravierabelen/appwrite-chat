import { createContext, useState, useEffect } from 'react'
import { account } from '../appWriteConfig'
import { useNavigate } from 'react-router-dom'
import { ID } from 'appwrite'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getUserOnLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUserDetails = async () => {
    const accountDetails = await account.get()
    setUser(accountDetails)
  }

  const getUserOnLoad = async () => {
    try {
      getUserDetails()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn()
      error
    }
    setLoading(false)
  }

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault()
    try {
      await account.createEmailPasswordSession(credentials.email, credentials.password)
      getUserDetails()
      navigate('/')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('There was an error trying to login', error)
    }
  }

  const handleUserLogout = async () => {
    await account.deleteSession('current')
    setUser(null)
  }

  const handleUserRegister = async (e, credentials) => {
    e.preventDefault()
    if (credentials.password1 !== credentials.password2) {
      alert('Passwords do not match!')
      return
    }
    try {
      setLoading(true)
      await account.create(ID.unique(), credentials.email, credentials.password1, credentials.name)
      await account.createEmailPasswordSession(credentials.email, credentials.password1)
      getUserDetails()
      navigate('/')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('There was an error trying to register', error)
    }
  }

  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  }

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  )
}

export default AuthContext
