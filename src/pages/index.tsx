import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'

import heroImg from '../../public/assets/images/hero.png'

export default function Home() {
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
            <span>+12 posts</span>
          </section>
          <section className={styles.box}>
            <span>+90 comentários</span>
          </section>
        </div>
      </div>
    </div>
  )
}
