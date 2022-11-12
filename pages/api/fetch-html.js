// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
const url = "https://github.com/lens-protocol/brand-kit"

export default async function handler(req, res) {
  const { body } = req
  const baseUrl = url.split('/')[2]
  const fullUrl = `https://${baseUrl}`
  const response = await fetch(url)
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
  const finalText = arr.join(" ")
  fs.writeFileSync('./page.html', finalText)

  res.status(200).json({ data: body.url })
}
