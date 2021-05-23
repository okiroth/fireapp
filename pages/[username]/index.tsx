import Link from 'next/link'

export default function UsernamePage({ }){
  return (
    <main>
      <Link prefetch={true} href={{
        pathname: '/',
      }}><a>Back Home</a></Link>
      <h1>I'm user</h1>
    </main>
  )
}