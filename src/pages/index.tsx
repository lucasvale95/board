import { app } from "@/services/firebaseConection";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore/lite";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/styles.module.scss"
import Image from "next/image";
import boardUser from '../../public/images/board-user.svg'

type Data = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string
}

interface HomeProps {
  data: string
}

export default function Home( {data}: HomeProps) {

  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data))

  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>

      <main className={styles.contentContainer}>
        <Image className={styles.image} src={boardUser} alt="Ferramenta Board" />

        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia. Escreva, planeje e organize-se.</h1>
          <p>
            <span>100% Gratuita </span>
            e online.
          </p>
        </section>

        {donaters.length !== 0 && <h3>Apoiadores:</h3>}
        <div className={styles.donaters}>
          <section>
            {donaters?.map((item)=> (
                <Image width={65} height={65} key={item.id} src={item.image} alt="Usuários" />
            ))}          
          </section>
        </div>
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const db = getFirestore(app)
  let data: string = ''
  

  await getDocs(collection(db, "users"))
        .then((doc)=>{ 
            data = JSON.stringify(doc.docs.map((doc) => ({
                ...doc.data(),
                id:doc.id 
            })));
  })
  

  return {
    props: {
      data
    },
    revalidate: 60 * 360   // Atualiza a cada 360 minutos
  }
}