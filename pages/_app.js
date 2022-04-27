import '../app/styles/globals.css'
import { Navbar } from '../app/components'
import { Toaster } from 'react-hot-toast'
import { UserContext } from '../app/contexts/authContext'
import { useUserData } from '../app/hooks/useUserData'

function MyApp({ Component, pageProps }) {
  const userData = useUserData()

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
