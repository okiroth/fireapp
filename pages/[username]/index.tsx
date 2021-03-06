import PostFeed from '../../components/PostFeed'
import UserProfile from '../../components/UserProfile'
import { getUserWithUsername, postToJSON } from '../../lib/firebase';

export async function getServerSideProps({ params }) {
  const userDoc = await getUserWithUsername(params.username);

  let user = null;
  let posts = null;

  // return 404
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  if (userDoc) {
    user = userDoc.data();
    
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  }
}

export default function UsernamePage({ user, posts }){
  return (
    <main>
      <UserProfile user={user}/>
      <PostFeed posts={posts} admin={true}/>
    </main>
  )
}