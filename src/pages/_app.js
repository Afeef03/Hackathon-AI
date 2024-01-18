import '@/styles/globals.css'
import 'regenerator-runtime/runtime'


export default function App({ Component, pageProps }) {
  return <div className="bg-gray-800 flex justify-center flex-col " style={{ backgroundColor: 'rgb(26 35 46)' }}><Component {...pageProps} /></div>
}
