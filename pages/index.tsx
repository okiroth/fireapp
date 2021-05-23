import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Loader from '../components/Loader'
import Toaster from 'react-hot-toast'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <button onClick={() => Toaster.success('Hello You!!!')}>
        Toaste Me
      </button>
    </div>
  )
}
