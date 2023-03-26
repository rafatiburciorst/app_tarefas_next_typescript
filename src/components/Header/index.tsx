import styles from '@/styles/Header.module.css'
import Link from 'next/link'

type Props = {}

const Header = (props: Props) => {
    return (
        <header className={styles.header}>
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href='/'>
                        <h1 className={styles.logo}>
                            Tarefas<span>+</span>
                        </h1>
                    </Link>
                    <Link href='/dashboard' className={styles.dashboard}>
                        Meu Painel
                    </Link>
                </nav>
                <button className={styles.loginButton}>Acessar</button>
            </section>
        </header>
    )
}

export default Header