import '../styles/globals.css'
import { css } from '@emotion/css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div className={containerStyle}>
      <Component {...pageProps} />
      <footer className={footerStyle}>
        <p className={footerText}><Link href="/how-it-works">How it works.</Link> Built with &nbsp;<a rel="noopener" href="https://www.arweave.org/" target="_blank">Arweave</a>
        &nbsp; and &nbsp;
        <a rel="noopener" target="_blank" href="https://bundlr.network/">Bundlr</a>.</p>
      </footer>
    </div>
  )
}

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const footerStyle = css`
  border-top: 1px solid rgba(255, 255, 255, .2);
  padding: 0px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin-top: auto;
  @media (max-width: 380px) {
    height: 80px;
  }
`

const footerText = css`
  font-size: 14px;
  margin: 0;
  a {
    color: #4975f0;
  }
`


export default MyApp
