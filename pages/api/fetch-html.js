// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
const PK = process.env.BNDLR_KEY
import Bundlr from "@bundlr-network/client"
const bundlr = new Bundlr("https://node1.bundlr.network", "matic", PK)

export default async function handler(req, res) {
  const { body } = req
  console.log({ body })
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
    id
  })
}
