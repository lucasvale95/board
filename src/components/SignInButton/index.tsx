import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import styles from "./styles.module.scss"
import { FaGithub } from "react-icons/fa"
import { FiX } from "react-icons/fi"

export function SignInButton() {

    const { data: session } = useSession()
    return session ? (
        <button 
        type="button" 
        className={styles.signInButton}
        onClick={()=> signOut()}>
            <Image width={35} height={35} src={session?.user?.image!} alt="Foto do usuário" />
            Olá {session?.user?.name}
            <FiX color="#737380" className={styles.closeIcon}/>
        </button>
    )
    :
    (
        <button 
        type="button" 
        className={styles.signInButton}
        onClick={()=> signIn()}>
            <FaGithub color="#FFb800"/>
            Entrar com github
        </button>
    )
}