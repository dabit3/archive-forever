const Bundlr = require("@bundlr-network/client").default
const puppeteer = require("puppeteer")

const PK = process.env.BNDLR_KEY
const bundlr = new Bundlr('https://node1.bundlr.network', 'matic', PK)

const main = async function (req, res) {
  const { body } = req
  console.log({ body })
  let screenshotUri = null

  const baseTag = {
    name: 'App-Name',
    value: 'archive-pages-app-by-nader'
  }

  if (body.file) {
    try {
      const tags = [{name: 'Content-Type', value: 'image/png' }, baseTag]
      const imageTransaction = bundlr.createTransaction(body.file, { tags })

      await imageTransaction.sign()
      let id = imageTransaction.id
      await imageTransaction.upload()
      imageURI = `https://arweave.net/${id}`

      return res.json({
        imageURI,
        id
      })
    } catch (err) {
      console.log('error uploading file...', err)
      return res.json({
        error: 'Error uploading file to arweave...'
      })
    }
  }

  if (body.screenshotEnabled) {
    const browser = await puppeteer.launch()

    try {
      const page = await browser.newPage()
      await page.goto(body.url)

      const _page = await page.$('html')
      const bounding_box = await _page.boundingBox()
      let height = bounding_box.height > 10000 ? 10000 : Math.round(bounding_box.height)

      await page.setViewport({
        width: Math.round(bounding_box.width),
        height
      })
      const screenshot = await page.screenshot()
      await browser.close()
      /* end puppeteer */

      const imageTags = [{name: 'Content-Type', value: 'image/png' }, baseTag]
      const imageTransaction = bundlr.createTransaction(screenshot, { tags: imageTags })

      await imageTransaction.sign()
      let imageId = imageTransaction.id
      await imageTransaction.upload()
      screenshotUri = `https://arweave.net/${imageId}`
      console.log({ screenshotUri })
    } catch (err) {
      console.log("Error uploading:: ", err)
      return res.status(200).json({
        error: err
      })
    }
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
  const tags = [{name: "Content-Type", value: "text/html"}, baseTag]

  const transaction = bundlr.createTransaction(finalText, { tags })

  await transaction.sign()
  let id = transaction.id
  await transaction.upload()
  const arweaveURI = `https://arweave.net/${id}`

  return res.json({
    link: arweaveURI,
    imageURI: screenshotUri,
    id
  })
}

module.exports =  main