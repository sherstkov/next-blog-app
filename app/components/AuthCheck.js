import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '@contexts/authContext'

export default function AuthCheck({ children, fallback }) {
  const { username } = useContext(UserContext)

  return username
    ? children
    : fallback || <Link href="/enter">Sign to coninute</Link>
}
