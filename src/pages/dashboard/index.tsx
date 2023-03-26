import styles from '@/styles/Dashboard.module.css'
import Head from 'next/head'
type Props = {}

const Dashboard = (props: Props) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>
            <h1>Página Painel</h1>
        </div>
    )
}

export default Dashboard