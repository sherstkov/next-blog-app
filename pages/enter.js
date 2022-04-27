import { auth, provider } from '@services/firebase'
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore'
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth'
import { useEffect, useState, useCallback, useContext } from 'react'
import { UserContext } from '@contexts/authContext'
import debounce from 'lodash.debounce'

export default function Enter({}) {
  const { user, username } = useContext(UserContext)

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  )
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
  }

  return (
    <>
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/google.png'} alt="Sign in" />
        Sign in with Google
      </button>
    </>
  )
}

function SignOutButton() {
  return <button onClick={() => signOut(auth)}>Sign Out</button>
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState('')
  const [isExist, setisExist] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  const onSubmit = async (e) => {
    e.preventDefault()

    // Create refs for both documents
    const userDoc = doc(getFirestore(), 'users', user.uid)
    const usernameDoc = doc(getFirestore(), 'usernames', formValue)

    // Commit both docs together as a batch write.
    const batch = writeBatch(getFirestore())
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    })
    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
  }

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()
    const re = /^[a-z0-9]{3,15}$/

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setisExist(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setisExist(false)
    }
  }

  //

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(getFirestore(), 'usernames', username)
        const snap = await getDoc(ref)
        console.log('Firestore read executed!', snap.exists())
        setisExist(!snap.exists())
        setLoading(false)
      }
    }, 500),
    []
  )

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isExist={isExist}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isExist}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Is username available: {isExist.toString()}
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isExist, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isExist) {
    return <p className="text-success">{username} is available!</p>
  } else if (username && !isExist) {
    return <p className="text-danger">That username is NOT available!</p>
  } else {
    return <p></p>
  }
}
