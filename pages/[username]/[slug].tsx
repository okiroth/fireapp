import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import PostContent from '../../components/PostContent'

export async function getStaticProps({ params }) {
  const { username, slug } = params;

  const userDoc = await getUserWithUsername(username);

  let post = null;
  let path = null;

  if (userDoc) {
    const query = firestore
      .collection('posts')
      .where('slug', '==', slug)
      .limit(1);
    post = postToJSON((await query.get()).docs[0]);
    path = `/${username}/${post.slug}`;
  }

  return {
    props: { post, path },
    revalidate: 5000, //milliseconds
  }
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup('posts').get();
  const paths = snapshot.docs.map(doc => {
    const { slug, username } = doc.data();
    return {
      params: { slug, username }
    }
  })
  return {
    // paths must be Array of { params: {username, slug} }
    paths,
    fallback: 'blocking', //default to server side rendering
  }
}


export default function Post(props){
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className="container">
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} &hearts;</strong>
        </p>
      </aside>
    
    </main>
  )
}