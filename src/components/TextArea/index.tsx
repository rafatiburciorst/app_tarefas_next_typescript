import styles from '@/styles/TextArea.module.css'
import { HTMLProps } from 'react'

type Props = {}

const index = ({ ...rest }: HTMLProps<HTMLTextAreaElement>) => {
    return (
        <textarea className={styles.textarea} {...rest} ></textarea>
    )
}

export default index