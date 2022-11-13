import { css } from '@emotion/css'
import Link from 'next/link'
import Head from 'next/head'

export default function HowItWorks() {
  return (
    <div>
      <Head>
        <title>Archive Forever</title>
        <meta name="description" content="How Archive Forever works" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="https://i.ibb.co/wK2j5Kq/igimage.jpg" />
      </Head>
      <div className={wrapperStyle}>
        <div className={mainContainerStyle}>
          <nav className={navStyle}>
            <Link href="/">Home</Link>
          </nav>
          <h1 className={titleStyle}>HOW IT WORKS.</h1>
          <div className={textContainerStyle}>
            <p>
            <a href="https://www.arweave.org/" target="_blank" rel="noopener">Arweave</a> is a new type of storage that backs data with sustainable and perpetual endowments, allowing users and developers to truly store data forever – for the very first time.
            </p>

            <p>
            As a collectively owned hard drive that never forgets, Arweave allows us to remember and preserve valuable information, apps, and history indefinitely. By preserving history, it prevents others from rewriting it.
            </p>

            <p>
            On top of the Arweave network lives the permaweb: a global, community-owned web that anyone can contribute to or get paid to maintain.
            </p>

            <p>
            The permaweb looks just like the normal web, but all of its content – from images to full web apps – is permanent, retrieved quickly, and decentralized – forever. Just as the first web connected people over vast distances, the permaweb connects people over extremely long periods of time.
            </p>

            <p>To learn more about Arweave, check out <a target="_blank" rel="noopener" href="https://www.arweave.org/">their website.</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

const navStyle = css`
  width: 800px;
  @media (max-width: 820px) {
    width: 100%;
    padding: 0px 40px;
  }
  @media (max-width: 520px) {
    padding: 0px 20px;
  }
`

const mainContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 720px) {
    padding: 0px 20px;
  }
`

const wrapperStyle = css`
  margin-top: 50px;
`

const titleStyle = css`
  margin-bottom: 0px;
  font-size: 64px;
  font-weight: 800;
  letter-spacing: 5px;
  text-align: center;
  @media (max-width: 720px) {
    font-size: 50px;
    padding: 0px 40px;
  }
  @media (max-width: 520px) {
    font-size: 40px;
    padding: 0px 20px;
  }
`

const textContainerStyle = css`
  width: 800px;
  margin-bottom: 50px;
  p {
    font-size: 20px;
  }
  a {
    color: #668bf9;
  }
  @media (max-width: 820px) {
    width: 100%;
    padding: 0px 40px;
    p {
      font-size: 16px;
    }
  }
  @media (max-width: 520px) {
    padding: 0px 20px;
  }
`