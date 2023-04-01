import styles from '@/styles/Home.module.css'
import { collection, getDocs } from 'firebase/firestore'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import heroImg from '../../public/assets/images/hero.png'
import { db } from '../services/firebaseConnection'

interface HomeProps {
  posts: number
  comments: number
}

export default function Home({ comments, posts }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>
      <div className={styles.logoContent}>
        <Image
          className={styles.hero}
          alt='Logo tarefa mais'
          src={heroImg}
          priority
        />
        <h1 className={styles.title}>
          Sitema feito para você organizar <br />
          seus estudos e tarefas
        </h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{comments} comentários</span>
          </section>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const commentRef = collection(db, 'comments')
  const postRef = collection(db, 'tarefas')

  const postSnapshot = await getDocs(postRef)
  const commentSnapshot = await getDocs(commentRef)

  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentSnapshot.size || 0
    },
    revalidate: 60
  }
}
