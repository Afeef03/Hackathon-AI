import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return <div className="bg-gray-800 flex justify-center flex-col " style={{ height: '100vh', backgroundColor: 'rgb(26 35 46)' }}><Component {...pageProps} /></div>
}
