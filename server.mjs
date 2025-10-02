
// file: server.mjs

import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

import MimeTypes from './core/mime-types.mjs'


const port = 6090
const host = '0.0.0.0'


const directories = new Map(Object.entries({
  html: './views',
  mjs: './assets',
}))

const defaultView = '/index.html'


const httpServer = new http.Server()

httpServer.on('request', async (request, response) => {

  try {
    if (request.url === defaultView) {
      throw new Error(
        `Error 404: Page (${ request.url }) Not Found`)
    }

    const url = request.url === '/'
      ? defaultView
      : request.url

    const extension = extname(url)?.slice(1)
    const mimeType = MimeTypes.get(extension, 'html')
    const directory = directories.get(extension)
    const file = join(directory, url.slice(1))

    if (!file) {
      throw new Error(
        `Error 404: Page ${ url } Not Found`)
    }

    const content = await readFile(file)

    if (!content) {
      throw new Error(
        `Error 404: Page ${ url } Not Found`)
    }

    response.statusCode = 200
    response.setHeader('Content-Type', mimeType)
    response.end(content)

  } catch (error) {

    const content = `<h1>Error 404: Page Not Found</h1>`
    const mimeType = MimeTypes.get('html')

    response.statusCode = 404
    response.setHeader('Content-Type', mimeType)
    response.end(content)

    console.log(error)

  } finally {
    console.log(
      `server: ${ response.statusCode } ${ request.url }`)
  }

})


const server = httpServer.listen(port, host, () => {

  const { address, family, port } = server.address()

  let host = ''
  host += family === 'IPv4' ? 'http://' : 'https://'
  host += address === '0.0.0.0' ? '127.0.0.1' : address
  host += [80, 443].includes(port) ? '' : `:${ port }`

  console.log(
    `server: start listen on ${ host }`)
})
