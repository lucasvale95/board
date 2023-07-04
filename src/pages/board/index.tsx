import { SupportButton } from "@/components/SupportButton";
import { useState, FormEvent } from 'react'
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import {FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX} from "react-icons/fi"
import styles from "./styles.module.scss"
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore/lite';
import { app } from "@/services/firebaseConection";
import { format, formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

type TaskList = {
    id: string;
    created: string | Date;
    createdFormated?: string;
    tarefa: string;
    email: string;
    name: string
}

interface BoardProps {
    user: {
        nome: string;
        email: string;
        vip: boolean;
        lastDonate: string | Date
    },
    data: string
}

export default function Board( { user, data }: BoardProps ){

    const [input, setInput] = useState('')
    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data))
    const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)
    const [filterTask, setFilterTask] = useState<TaskList[]>(taskList.filter((task)=> task.email == user.email))

    async function handleAddTask (e: FormEvent) {
        e.preventDefault()

        const db = getFirestore(app)
        const userCollectionRef = collection(db, "tarefas")

        if(input == ''){
            alert('Preencha alguma tarefa!')
            return
        }        

        if(taskEdit){
            const taskRef = doc(db, "tarefas", taskEdit.id)
            await updateDoc(taskRef, {
                tarefa: input
            }).then(()=> {
                let data = filterTask
                let taskIndex = filterTask.findIndex(item => item.id == taskEdit.id)
                data[taskIndex].tarefa = input

                setFilterTask(data)
                setTaskEdit(null)
                setInput('')
            }).catch(()=> {})

            return
        }

        const tarefa = await addDoc(userCollectionRef, {
            created: new Date(),
            tarefa: input,
            name: user.nome,
            email: user.email
        }).then((doc)=> {
            let data = {
                id: doc.id,
                created: new Date(),
                createdFormated: format(new Date(), 'dd MMMM yyyy'),
                tarefa: input,
                name: user.nome,
                email: user.email
            }

            setTaskList([...taskList, data])
            setFilterTask([...filterTask, data])
            setInput('')
        })
        .catch ((err)=> {

        })
    }

    const db = getFirestore(app)

    async function handleDelete (id: string) {
        await deleteDoc(doc(db, "tarefas", id)).then(()=> {
                let taskDeleted = filterTask.filter( item => {
                    return (item.id !== id)
                })

                setFilterTask(taskDeleted)

            }).catch((err)=>{
                console.log(err)
            })      
    }

    function handleEditTask (task: TaskList) {
        setInput(task.tarefa)
        setTaskEdit(task)
    }

    function handleCancelEdit () {
        setInput('')
        setTaskEdit(null)
    }

    {console.log(user.lastDonate, new Date())}

    return(
        <>
            <Head>
                <title>Minhas tarefas - Board</title>
            </Head>

            <main className={styles.container}>

                {
                    taskEdit  && (

                        <span className={styles.warnText}>
                            <button onClick={handleCancelEdit}>
                                <FiX size={25} color="#FF3636"/>
                            </button>
                            Você está editando uma tarefa!
                        </span>
                    )
                }

                <form onSubmit={handleAddTask}>

                    <input type="text"
                    placeholder="Digite sua tarefa..." 
                    value={input}
                    onChange={(e)=> setInput(e.target.value)}
                    />

                    <button type="submit">
                        <FiPlus size={25} color="#17181f"/>
                    </button>

                </form>

                {filterTask.length === 0 ? (
                    <h1>Você não tem nenhuma tarefa.</h1>

                ): 
                (
                    <>
                    <h1>Você tem {filterTask.length} {filterTask.length === 1 ? 'tarefa': 'tarefas'}!</h1>

                    <section>
                        {filterTask.map( task => (
                            <article key={task.id} className={styles.taskList}>
                                <p>
                                    {task.tarefa}
                                </p>
                            <div className={styles.actions}>
                                <div>
                                    <div>
                                        <FiCalendar size={20} color="#ffb800" />
                                        <time>{task.createdFormated}</time>
                                    </div>
    
                                    {user.vip && (
                                        <button onClick={()=> handleEditTask(task)}>
                                            <FiEdit2 size={20} color="#FFF"/>
                                            <span>Editar</span>
                                        </button>
                                    )}
                                </div>
    
                                <button onClick={()=> handleDelete(task.id)}>
                                    <FiTrash size={20} color="#FF3636"/>
                                    <span>Excluir</span>
                                </button>
                            </div>
                            </article>
                        ))}
                        
    
                    </section>
                    </>
                )
                
            }
               
            </main>

            {
                user.vip && (
                    <div className={styles.vipContainer}>
                        <h3>Obrigado por apoiar esse projeto.</h3>
                    </div>
                )
            }

            <SupportButton />
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session: any = await getSession({ req });
  
    if(!session?.user){
      //Se o user nao tiver logado vamos redirecionar.
      return{
        redirect:{
          destination: '/',
          permanent: false
        }
      }
    }

    const db = getFirestore(app)

    let data: string = ''

    await getDocs(collection(db, "tarefas"))
        .then((tasks)=>{ 
            data = JSON.stringify(tasks.docs.map((doc) => ({
                ...doc.data(), 
                createdFormated: format(doc.data().created.toDate(), 'dd MMMM yyyy'),
                id:doc.id 
            })));
        })

        const user = {
            nome: session?.user.name,
            id: session?.id,
            vip: session?.vip,
            lastDonate: session?.lastDonate
        }

    return {
        props: {
            user,
            data
        }
    }
}