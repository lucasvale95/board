import styles from './styles.module.scss'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { doc, getFirestore, setDoc } from 'firebase/firestore/lite'
import { app } from '@/services/firebaseConection'
import { useState } from 'react'
import Image from 'next/image'
import rocketImage from '../../../public/images/rocket.svg'

interface DonateProps {
    user: {
        name: string;
        email: string;
        image: string;
    }
}


export default function Donate ({ user }: DonateProps ) {
    const [vip, setVip] = useState(false)

    async function handleSaveDonate( ){
        const db = getFirestore(app)
        const userRef = doc(db, "users", user.email)
        await setDoc(userRef, {
            donate: true,
            lastDonate: new Date(),
            image: user.image
        }).then(()=> {
            setVip(true)
        })
    }

    return (
        <>
            <Head>
                <title>Ajude a plataforma board ficar online!</title>
            </Head>
            <main className={styles.container}>
                <Image src={rocketImage} alt="Seja apoiador" />

                { vip && (
                    <div className={styles.vip}>
                        <Image width={50} height={50} src={user?.image} alt="Foto Apoiador" />
                        <span>Parabéns! Você é um novo apoiador.</span>
                    </div>
                )}

                <h1>Seja um apoiador deste projeto 🏆</h1>
                <h3>Contribua com apenas <span>R$ 1,00</span></h3>
                <strong>Apareça na nossa home, tenha funcionalidades exclusivas.</strong>
            
                <PayPalButtons createOrder={ (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '1'
                            }
                        }]
                    })                    
                }}
                onApprove={(data, actions):any=> {
                    return actions.order?.capture().then(function(details) {
                        
                        handleSaveDonate()
                    })
                }}
                />
            </main>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const session = await getSession({req})

    if(!session?.user?.email){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const user = {
        nome: session?.user.name,
        image: session?.user.image,
        email: session?.user.email,
    }

    return {
        props: {
            user
        }
    }
}