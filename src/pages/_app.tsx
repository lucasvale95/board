import type { AppProps } from 'next/app'
import { Header } from '@/components/Header'
import { SessionProvider } from "next-auth/react"
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import "../styles/global.scss"

const initialIOptions = {
  "client-id": "AWSbvJqio7KWsESszGUzxZ6UMnm7fNxtZlC0FVAAw-gN_-TOa5cKTKVtCiWILNgoXng_QFjG-p0WW3GT",
  currency: "BRL",
  intent: 'capture'
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <PayPalScriptProvider options={initialIOptions}>
          <Header/>
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </SessionProvider>
    </>
  )
}
