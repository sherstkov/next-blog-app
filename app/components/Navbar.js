import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '@contexts/authContext'
import { auth } from '@services/firebase'
import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'

export default function Navbar() {
  const { user, username } = useContext(UserContext)

  const router = useRouter()

  const signOutNow = () => {
    signOut(auth)
    router.reload()
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">home</button>
          </Link>
        </li>

        {username && (
          <>
            <li className="push-left">
              <button onClick={signOutNow}>Sign Out</button>
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL || '/hacker.png'} />
              </Link>
            </li>
          </>
        )}

        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
