import { getUserWithUsername, postToJSON } from '@services/firebase'
import {
  doc,
  getDocs,
  getDoc,
  collectionGroup,
  query,
  limit,
  getFirestore,
} from 'firebase/firestore'
import { UserContext } from '@contexts/authContext'
import { useContext } from 'react'
import Link from 'next/link'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import styles from '@styles/Post.module.css'
import { PostContent, AuthCheck, HeartButton } from '@components/index'

export async function getStaticProps({ params }) {
  const { username, slug } = params
  const userDoc = await getUserWithUsername(username)

  let post
  let path

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug)
    post = postToJSON(await getDoc(postRef))
    path = postRef.path
  }

  return {
    props: { post, path },
    revalidate: 100,
  }
}

export async function getStaticPaths() {
  const q = query(collectionGroup(getFirestore(), 'posts'), limit(20))
  const snapshot = await getDocs(q)

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data()
    return {
      params: { username, slug },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export default function PostPage(props) {
  const postRef = doc(getFirestore(), props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post

  const { user: currentUser } = useContext(UserContext)

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  )
}
