import { getUserWithUsername, postToJSON, firestore } from '@services/firebase'
import {
  query,
  collection,
  where,
  getDocs,
  limit,
  orderBy,
  getFirestore,
} from 'firebase/firestore'
import { UserProfile, PostFeed } from '@components/index'

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery
  const userDoc = await getUserWithUsername(username)

  //if no user hits 404
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()
    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    )
    posts = (await getDocs(postsQuery)).docs.map(postToJSON)
  }

  return {
    props: { user, posts },
  }
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}
