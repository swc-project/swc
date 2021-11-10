// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/send/sendFile.ts


import { Req, Res } from '../../../deps.ts'
import { isAbsolute, join, extname } from 'https://deno.land/std@0.101.0/path/mod.ts'
import { contentType } from '../../../deps.ts'
import { createETag } from '../utils.ts'
import { send } from './send.ts'

export type SendFileOptions = Partial<{
  root: string
  headers: Record<string, string>
  encoding: string
  end: number
  start: number
}> &
  Deno.OpenOptions

/**
 * Sends a file by piping a stream to response.
 *
 * It also checks for extension to set a proper `Content-Type` header.
 *
 * Path argument must be absolute. To use a relative path, specify the `root` option first.
 *
 * @param res Response
 */
export const sendFile =
  <Request extends Req = Req, Response extends Res = Res>(req: Request, res: Response) =>
  (path: string, opts: SendFileOptions = {}) => {
    const { root, headers = {}, encoding = 'utf-8', ...options } = opts

    if (!isAbsolute(path) && !root) throw new TypeError('path must be absolute')

    const filePath = root ? join(root, path) : path

    const stats = Deno.statSync(filePath)

    headers['Content-Encoding'] = encoding

    headers['Last-Modified'] = stats.mtime!.toUTCString()

    headers['Content-Type'] = contentType(extname(path)) || 'text/html'

    headers['ETag'] = createETag(stats)

    headers['Content-Length'] = `${stats.size}`

    headers['Content-Security-Policy'] = "default-src 'none'"
    headers['X-Content-Type-Options'] = 'nosniff'

    let status = 200

    if (req.headers.get('range')) {
      status = 206
      const [x, y] = req.headers?.get('range')?.replace('bytes=', '').split('-') as [string, string]
      const end = (options.end = parseInt(y, 10) || stats.size - 1)
      const start = (options.start = parseInt(x, 10) || 0)

      if (start >= stats.size || end >= stats.size) {
        res.status = 416
        res.headers?.set('Content-Range', `bytes */${stats.size}`)
        req.respond({})
        return res
      }
      headers['Content-Range'] = `bytes ${start}-${end}/${stats.size}`
      headers['Content-Length'] = `${end - start + 1}`
      headers['Accept-Ranges'] = 'bytes'
    }

    for (const [k, v] of Object.entries(headers)) res.headers?.set(k, v)

    res.status = status

    const file = Deno.openSync(filePath, { read: true, ...options })

    send(req, res)(file)

    return res
  }
