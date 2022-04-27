import { initializeApp, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import {
  getFirestore,
  collection,
  where,
  getDocs,
  query,
  limit,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {}

function createFirebaseApp(config) {
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}
const app = createFirebaseApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

export const firestore = getFirestore(app)

export const storage = getStorage(app)
export const STATE_CHANGED = 'state_changed'

/// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const q = query(
    collection(firestore, 'users'),
    where('username', '==', username),
    limit(1)
  )
  const userDoc = (await getDocs(q)).docs[0]
  return userDoc
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}
