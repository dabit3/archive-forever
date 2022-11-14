import '../styles/globals.css'
import { css } from '@emotion/css'
import Link from 'next/link'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <div className={containerStyle}>
        <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-CPYN5JNGKZ');
        `}
        </Script>
      <Component {...pageProps} />
      <footer className={footerStyle}>
        <p className={footerText}><Link href="/how-it-works">How it works.</Link> Built with &nbsp;<a rel="noopener" href="https://www.arweave.org/" target="_blank">Arweave</a>
        &nbsp; and &nbsp;
        <a rel="noopener" target="_blank" href="https://bundlr.network/">Bundlr</a>. <a href="https://github.com/dabit3/archive-forever" rel="noopener" target="_blank"><img className={githubLinkStyle} src='/github.svg' alt='loading...' /></a></p>
      </footer>
    </div>
  )
}

const githubLinkStyle = css`
  width: 32px;
  height: 32px;
  margin-bottom: -12px;
  margin-left: -2px;
`

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
