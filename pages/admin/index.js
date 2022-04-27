import kebabCase from 'lodash.kebabcase'
import toast from 'react-hot-toast'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import {
  serverTimestamp,
  query,
  collection,
  orderBy,
  getFirestore,
  setDoc,
  doc,
} from 'firebase/firestore'

import { auth } from '@services/firebase'
import { AuthCheck, PostFeed } from '@components/index'
import { UserContext } from '@contexts/authContext'
import styles from '@styles/Admin.module.css'

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref = collection(getFirestore(), 'users', auth.currentUser.uid, 'posts')
  const postQuery = query(ref, orderBy('createdAt'))

  const [querySnapshot] = useCollection(postQuery)

  const posts = querySnapshot?.docs.map((doc) => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')
  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = doc(getFirestore(), 'users', uid, 'posts', slug)

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: 'write a few words here',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }

    await setDoc(ref, data)

    toast.success('Post created!')

    router.push(`/admin/${slug}`)
  }

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My New Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  )
}
