import { LogOut } from 'react-feather'
import { useAuth } from '../hooks/useAuth'

const Header = () => {
  const { user, handleUserLogout } = useAuth()

  return (
    <div id="header-wrapper">
      {user ? (
        <>
          Welcome {user.name}
          <LogOut className="header-link" onClick={handleUserLogout} />
        </>
      ) : (
        <button> Login </button>
      )}
    </div>
  )
}

export default Header
