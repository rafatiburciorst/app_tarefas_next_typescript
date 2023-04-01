import { ChangeEvent, FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import { collection, doc, getDoc, query, where, addDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { GetServerSideProps } from "next"
import Head from "next/head"
import { FaTrash } from 'react-icons/fa'

import { db } from '../../services/firebaseConnection'
import styles from '../../styles/Task.module.css'
import TextArea from '../../components/TextArea'

type Props = {
    item: TaskProps,
    allComments: CommentProps[]
}

interface TaskProps {
    taskId: string,
    tarefa: string,
    public: boolean,
    created: string,
    user: string,
}

interface CommentProps {
    id: string
    comment: string
    taskId: string
    user: string
    name: string
}

const Task = ({ item, allComments }: Props) => {

    const { data: session } = useSession()
    const [input, setInput] = useState('')
    const [comments, setComments] = useState<CommentProps[]>(allComments || [])

    const handleComment = async (event: FormEvent) => {
        event.preventDefault()
        if (input === '') return;
        if (!session?.user?.email || !session?.user?.name) return;

        try {
            const docRef = await addDoc(collection(db, 'comments'), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            })

            const data: CommentProps = {
                id: docRef.id,
                comment: input,
                name: session?.user?.name,
                user: session?.user?.email,
                taskId: item?.taskId
            }

            setComments((oldItems) => [...oldItems, data])

            setInput('')
        } catch (err) {
            console.log(err);

        }

    }


    const handleDeleteComment = async (id: string) => {
        try {
            const docRef = doc(db, 'comments', id)
            await deleteDoc(docRef)

            const deleteComment = comments.filter((item) => item.id !== id)
            setComments(deleteComment)

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={styles.container}>

            <Head>
                <title>Detalhes da Tarefa</title>
            </Head>
            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.task}>
                    <p>
                        {item?.tarefa}
                    </p>
                </article>
            </main>
            <section className={styles.commentContainer}>
                <h2>Fazer comentário</h2>
                <form onSubmit={handleComment}>
                    <TextArea
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                        value={input}
                        placeholder='Digite seu comentário'
                    />
                    <button
                        disabled={!session?.user}
                        className={styles.button}>Enviar Comentário</button>
                </form>
            </section>
            <section className={styles.commentContainer}>
                <h2>Todos Commentários</h2>
                {comments.length === 0 && (
                    <span>Nenhum Comentário foi encontrado</span>
                )}
                {comments.map((comment) => (
                    <article key={comment.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentsLabel}>
                                {comment.name}
                            </label>
                            {item.user === session?.user?.email && (
                                <button onClick={() => handleDeleteComment(comment.id)} className={styles.buttonTrash}>
                                    <FaTrash size={18} color='#ea3140' />
                                </button>
                            )}
                        </div>
                        <p>{comment.comment}</p>
                    </article>
                ))}
            </section>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const id = params?.id as string
    const docRef = doc(db, 'tarefas', id)

    const q = query(collection(db, 'comments'), where('taskId', '==', id))
    const snapshotComments = await getDocs(q)

    let allComments: CommentProps[] = []

    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc?.id,
            comment: doc.data()?.comment,
            user: doc.data()?.user,
            name: doc.data()?.name,
            taskId: doc.data()?.taskId
        })
    })


    const snapshot = await getDoc(docRef)

    if (snapshot.data() === undefined) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    if (!snapshot.data()?.public) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const miliseconds = snapshot.data()?.created?.seconds * 1000
    const task = {
        taskId: id,
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
    }

    return {
        props: {
            item: task,
            allComments: allComments
        }
    }
}

export default Task