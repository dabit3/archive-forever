import Head from 'next/head'
import axios from 'axios'
import { useState } from 'react'
import { css, keyframes } from '@emotion/css'

export default function Home() {
  const [url, setUrl] = useState('')
  const [link, setLink] = useState('')
  const [screenshot, setScreenshot] = useState('')
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [screenshotEnabled, setScreenshotEnabled] = useState(false)
  async function post() {
    if (!url || (!url.startsWith('http') && !url.startsWith('https'))){
      console.log('must be a valid url')
      console.log('url ', url)
      return
    }
    setLoading(true)
    setLink('')
    setHash('')
    setScreenshot('')
   try {
    const response = await axios.post('/api/fetch-html', {
      url,
      screenshotEnabled
    })
    console.log({ response })
    console.log({ response })
    setHash(response.data.id)
    setLink(response.data.link)
    setScreenshot(response.data.screenshotUri)
    setUrl('')
    setLoading(false)
   } catch(err) {
    console.log('Error archiving page...', err)
    setLoading(false)
    setUrl('')
   }
  }

  return (
    <div>
      <Head>
        <title>Archive Forever</title>
        <meta name="description" content="Archive any webpage forever on the blockchain with Arweave" />
        <link rel="icon" href="/favicon.ico" />
        
        <meta property="og:url" content="https://www.archiveforever.xyz/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Archive Forever" />
        <meta property="og:description" content="Archive any webpage forever on the blockchain with Arweave." />
        <meta property="og:image" content="https://raw.githubusercontent.com/dabit3/archive-forever/main/public/igimage.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="archiveforever.xyz" />
        <meta property="twitter:url" content="https://www.archiveforever.xyz/" />
        <meta name="twitter:title" content="Archive Forever" />
        <meta name="twitter:description" content="Archive any webpage forever on the blockchain with Arweave." />
        <meta name="twitter:image" content="https://raw.githubusercontent.com/dabit3/archive-forever/main/public/igimage.jpg" />
        <meta name="twitter:image:src" content="https://raw.githubusercontent.com/dabit3/archive-forever/main/public/igimage.jpg" />
      </Head>
      <div className={wrapperStyle}>
        <div className={mainContainerStyle}>
          <h1 className={titleStyle}>
            ARCHIVE FOREVER
          </h1>
          <p className={descriptionStyle}>Archive any webpage, forever.</p>
          <input
            onChange={e => {
              setUrl(e.target.value)
              setLink('')
              setHash('')
              setScreenshot('')
              setScreenshotEnabled(false)
            }}
            placeholder="Archive a web page"
            className={inputStyle}
            value={url}
          />
          {
            !link && (
              <div className={archiveConfigStyle}>
                <button onClick={post} className={archiveButtonStyle}>
                  ARCHIVE
                  {
                    loading && (<img className={loaderStyle} src='/spinner.svg' alt='loading...' />)
                  }
                </button>
                <div className={screenshotDetailsStyle}>
                  <div className={checkboxContainerStyle}
                    onClick={() => {
                      setScreenshotEnabled(!screenshotEnabled)
                    }}
                  >
                     {
                      screenshotEnabled && (
                        <img className={checkboxStyle} src='/checkmark.svg' alt='Include screenshot?' />
                      )
                     }
                  </div>
                  <p>Include screenshot?</p>
                </div>
              </div>
            )
          }
          {
            link && (
              <div className={linkContainerStyle}>
                <a
                  href={link}
                  rel="noopener"
                  target="_blank"
                >
                  <p className={buttonStyle}>
                  View Archived Page
                  </p>
                </a>
                {
                  screenshot && (
                    <a
                      href={screenshot}
                      rel="noopener"
                      target="_blank"
                    >
                      <p className={viewLinkButton}>
                      View Screenshot of Page
                      </p>
                    </a>
                  )
                }
              </div>
            )
          }
          {
            hash && (
              <div className={transactionInfoContainer}>
                <p className={transactionHashStyle}>Arweave transaction hash: <span className={hashStyle}>{hash}</span></p>
                <p>Want to support this project? Send Matic, ETH, or stablecoins to <a href="https://polygonscan.com/address/0xf59B3Cd80021b77c43EA011356567095C4E45b0e" target="_blank" rel="noopener" className={hashStyle}>this address.</a></p>
              </div>
            )
          }
        </div>
      </div>

    </div>
  )
}

const archiveConfigStyle = css`
  display: flex;
  margin-top: 20px;
  @media (max-width: 740px) {
    flex-direction: column;
  }
  @media (max-width: 720px) {
    margin-top: 0px;
  }
`

const screenshotDetailsStyle = css`
  display: flex;
  align-items: center;
  margin-left: 15px;
  p {
    margin: 0px 0px 0px 10px;
  }
  @media (max-width: 740px) {
    margin-top: 15px;
    margin-left: 0px;
  }
`

const checkboxContainerStyle = css`
  background-color: rgba(255, 255, 255, 1);
  width: 26px;
  height: 26px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`

const checkboxStyle = css`
  width: 20px;
  height: 20px;
`

const spin = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`

const loaderStyle = css`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  animation: ${spin} 1s linear infinite;
`

const titleStyle = css`
  margin-bottom: 0px;
  font-size: 64px;
  font-weight: 800;
  letter-spacing: 5px;
  text-align: center;
  @media (max-width: 720px) {
    font-size: 50px;
  }
  @media (max-width: 520px) {
    font-size: 40px;
  }
`

const inputStyle = css`
  width: 600px;
  border-radius: 30px;
  border: none;
  outline: none;
  padding: 8px 20px;
  height: 42px;
  font-size: 16px;
  background-color: #343434;
  @media (max-width: 720px) {
    width: 100%;
  }
`

const buttonStyle = css`
  height: 36px;
  font-size: 16px;
  padding: 0px 35px;
  background-color: #4975f0;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 2px;
  transition: background-color .35s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, .15);
  &:hover {
    background-color: #799cff;
  }
  @media (max-width: 720px) {
    margin-top: 0px;
  }
`

const archiveButtonStyle = css`
  ${buttonStyle};
  @media (max-width: 720px) {
    margin-top: 20px;
  }
`

const viewLinkButton = css`
  ${buttonStyle};
  margin-left: 12px;
  background-color: white;
  color: black;
  &:hover {
    background-color: rgba(255, 255, 255, .80);
  }
  @media (max-width: 720px) {
    margin-left: 0px;
    margin-top: 10px;
  }
`

const linkContainerStyle = css`
  display: flex;
  margin-top: 18px;
  @media (max-width: 720px) {
    flex-direction: column;
    margin-top: 14px;
  }
`

const mainContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  @media (max-width: 720px) {
    padding: 0px 20px;
  }
`

const transactionHashStyle = css`
  max-width: 100%;
  @media (max-width: 380px) {
    font-size: 14px;
  }
`

const transactionInfoContainer = css`
  margin-top: 20px;
`

const hashStyle = css`
  color: #4975f0;
`

const wrapperStyle = css`
  margin-top: 100px;
`

const descriptionStyle = css`
  fontSize: 14px;
`