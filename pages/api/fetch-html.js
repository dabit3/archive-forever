import Bundlr from '@bundlr-network/client'
import chromium from 'chrome-aws-lambda'
import playwright from "playwright-core";

const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const PK = process.env.BNDLR_KEY
const bundlr = new Bundlr("https://node1.bundlr.network", "matic", PK)

export default async function handler(req, res) {

  const executablePath = await chromium.executablePath || LOCAL_CHROME_EXECUTABLE

  const { body } = req
  let screenshotUri = null
  console.log({ body })
  
  if (body.screenshotEnabled) {
    /* begin puppeteer */
    // const browser = await puppeteer.launch();

    const browser = await playwright.chromium.launch({
      args: [...chromium.args, "--font-render-hinting=none"], // This way fix rendering issues with specific fonts
      executablePath,
      headless:
        process.env.NODE_ENV === "production" ? chromium.headless : true,
    })

    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(body.url, {
      waitUntil: "load",
    })
    const screenshot = await page.screenshot({
      fullPage: true
    })

    await browser.close();
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
