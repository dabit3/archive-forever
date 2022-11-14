import Bundlr from '@bundlr-network/client'
import puppeteer from 'puppeteer'

const PK = process.env.BNDLR_KEY
const bundlr = new Bundlr("https://node1.bundlr.network", "matic", PK)

export default async function handler(req, res) {
  const { body } = req
  let screenshotUri = null
  
  if (body.screenshotEnabled) {
    const IS_PRODUCTION = process.env.NODE_ENV === 'production'
    let browser
    /* begin puppeteer */
    if (IS_PRODUCTION) {
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_KEY}`,
        defaultViewport: null
      })
    } else {
      browser = await puppeteer.launch()
    }

    const page = await browser.newPage()
    await page.goto(body.url, { waitUntil: 'networkidle0' })

    const example = await page.$('html')
    const bounding_box = await example.boundingBox()

    await page.setViewport({
      width: Math.round(bounding_box.width),
      height: Math.round(bounding_box.height)
    })
    const screenshot = await page.screenshot()
    await browser.close()
    /* end puppeteer */

    const imageTags = [{name: 'Content-Type', value: 'image/png' }]
    const imageTransaction = bundlr.createTransaction(screenshot, { tags: imageTags })

    await imageTransaction.sign()
    let imageId = imageTransaction.id
    await imageTransaction.upload()
    screenshotUri = `https://arweave.net/${imageId}`
  }

  const baseUrl = body.url.split('/')[2]
  const fullUrl = `https://${baseUrl}`
  const response = await fetch(body.url)
  const text = await response.text()
  let arr = text.split(' ')
  arr = arr.map(item => {
    if (item.includes('.css')) {
      if (item.startsWith('href="/')) {
        item = item.replace('/', `${fullUrl}/`)
      }
      if (item.startsWith("href='/")) {
        item = item.replace('/', `${fullUrl}/`)
      }
      if (item.startsWith('href="./')) {
        item = item.replace('.', `${fullUrl}`)
      }
      if (item.startsWith("href='.")) {
        item = item.replace('.', `${fullUrl}`)
      }
    }
    return item
  })
  let finalText = arr.join(" ")
  finalText = finalText.replace(/(^[ \t]*\n)/gm, "")
  finalText = finalText.replace(/(^"|"$)/g, '')
  const tags = [{name: "Content-Type", value: "text/html"}]

  const transaction = bundlr.createTransaction(finalText, { tags })

  await transaction.sign()
  let id = transaction.id
  await transaction.upload()
  const arweaveURI = `https://arweave.net/${id}`
  // fs.writeFileSync('./page.html', finalText)

  res.status(200).json({
    link: arweaveURI,
    screenshotUri,
    id
  })
}
