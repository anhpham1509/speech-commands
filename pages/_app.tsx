import '../styles/globals.css'
import "../styles/app.css";
import "../styles/recorderControls.css";
import "../styles/recordingList.css";

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
