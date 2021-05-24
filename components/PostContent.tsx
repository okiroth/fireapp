import { fromMillis } from "../lib/firebase";
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'


export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
      <br /><br />
      <span className="text-sm">
        Written by {' '}
        <Link href={`/${post.username}`}>
          <a className="text-info" href="">@{post.username}</a>
        </Link> {' '}
        on {createdAt.toISOString()}
      </span>

      <ReactMarkdown>{post?.markdown}</ReactMarkdown>
    </div>
  )
}