import { SupportButton } from "@/components/SupportButton";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import {FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock} from "react-icons/fi"
import styles from "./styles.module.scss"

export default function Board( ){
    return(
        <>
            <Head>
                <title>Minhas tarefas - Board</title>
            </Head>

            <main className={styles.container}>

                <form action="">

                    <input type="text"
                    placeholder="Digite sua tarefa..." />

                    <button type="submit">
                        <FiPlus size={25} color="#17181f"/>
                    </button>

                </form>

                <h1>Você tem 2 tarefas!</h1>

                <section>
                    <article className={styles.taskList}>
                        <p>
                            Aprender criar projetos usando NextJS e aplicando firebase como back
                        </p>
                        <div className={styles.actions}>
                            <div>
                                <div>
                                    <FiCalendar size={20} color="#ffb800" />
                                    <time>17 Julho 2021</time>
                                </div>

                                <button>
                                    <FiEdit2 size={20} color="#FFF"/>
                                    <span>Editar</span>
                                </button>
                            </div>
                            <button>
                                <FiTrash size={20} color="#FF3636"/>
                                <span>Excluir</span>
                            </button>
                        </div>
                    </article>

                </section>
            </main>

            <div className={styles.vipContainer}>
                <h3>Obrigado por apoiar esse projeto.</h3>
                <div>
                    <FiClock size={22} color="#FFF"/>
                    <time>
                        Ultima doação foi a 3 dias.
                    </time>
                </div>
            </div>

            <SupportButton />
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req}) => {

    const session = await getSession({req});

    if(!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}