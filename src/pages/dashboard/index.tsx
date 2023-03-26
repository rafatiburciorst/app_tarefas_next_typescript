import TextArea from '@/components/TextArea'
import { db } from '@/services/firebaseConnection'
import styles from '@/styles/Dashboard.module.css'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { FiShare2 } from 'react-icons/fi'

interface HomeProps {
    user: {
        email: string
    }
}

interface TaskProps {
    id: string
    created: Date
    public: boolean
    tarefa: string
    user: string
}


const Dashboard = ({ user }: HomeProps) => {
    const [input, setInput] = useState("")
    const [publicTask, setPutblicTask] = useState(false)
    const [task, setTask] = useState<TaskProps[]>([])

    useEffect(() => {
        async function carregaTarefas() {
            const tarefasRef = collection(db, 'tarefas')
            const q = query(
                tarefasRef,
                orderBy('created', 'desc'),
                where('user', '==', user?.email)
            )

            onSnapshot(q, (snapshot) => {
                let lista = [] as TaskProps[]
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public
                    })
                })

                setTask(lista)


            })
        }
        carregaTarefas()
    }, [user?.email])

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        setPutblicTask(event.target.checked)
    }

    async function handleRegisterTask(event: FormEvent) {
        event.preventDefault()
        if (input === '') return;

        try {

            await addDoc(collection(db, 'tarefas'), {
                tarefa: input,
                created: new Date(),
                user: user?.email,
                public: publicTask
            })

            setInput('')
            setPutblicTask(false)

        } catch (err) {
            console.log(err);

        }
    }

    async function handleShare(id: string) {
        await navigator.clipboard.writeText(`
            ${process.env.NEXT_PUBLIC_URL}/task/${id}
        `)
        alert('URL copiada com sucesso!')

    }

    async function handleDelete(id: string) {
        const docRef = doc(db, 'tarefas', id)
        await deleteDoc(docRef)
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>
            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua tarefa</h1>
                        <form onSubmit={handleRegisterTask}>
                            <TextArea
                                placeholder='Digite qual sua tarefa'
                                value={input}
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                            />
                            <div className={styles.checkboxArea}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={publicTask}
                                    onChange={handleChangePublic}
                                />
                                <label>Deixar Tarefa pública</label>
                            </div>
                            <button type="submit" className={styles.button}>
                                Registrar
                            </button>
                        </form>
                    </div>
                </section>
                <section className={styles.taskContainer}>
                    <h1>Minhas Tarefas</h1>
                    {task.map((item) => (
                        <article key={item.id} className={styles.task}>
                            {item.public && (
                                <div className={styles.tagContainer}>
                                    <label className={styles.tag}>Público</label>
                                    <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                                        <FiShare2 size={22} color='#3183ff' />
                                    </button>
                                </div>
                            )}
                            <div className={styles.taskContent}>
                                {item.public ? (
                                    <Link href={`/task/${item.id}`}>
                                        <p>{item.tarefa}</p>
                                    </Link>
                                ) : (
                                    <p>{item.tarefa}</p>
                                )}
                                <button className={styles.trashButton} onClick={() => handleDelete(item.id)}>
                                    <FaTrash size={24} color='#ea3140' />
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req })

    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    // console.log(session)
    return {
        props: {
            user: {
                email: session?.user?.email
            }
        }
    }
}

export default Dashboard