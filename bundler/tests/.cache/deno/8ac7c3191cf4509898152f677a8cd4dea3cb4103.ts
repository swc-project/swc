// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/send/send.ts


import { Req, Res } from '../../../deps.ts'
import { json } from './json.ts'
import { createETag, setCharset } from '../utils.ts'
import { end } from '../end.ts'

export const send =
  <Request extends Req = Req, Response extends Res = Res>(req: Request, res: Response) =>
  (body: any) => {
    let bodyToSend = body

    // in case of object - turn it to json
    if (typeof body === 'object' && body !== null) {
      bodyToSend = JSON.stringify(body, null, 2)
    } else {
      if (typeof body === 'string') {
        // reflect this in content-type
        const type = res.headers?.get('Content-Type')

        if (type && typeof type === 'string') {
          res.headers?.set('Content-Type', setCharset(type, 'utf-8'))
        } else res.headers?.set('Content-Type', setCharset('text/html', 'utf-8'))
      }
    }

    // populate ETag
    let etag: string | undefined
    if (body && !res.headers?.get('etag') && (etag = createETag(bodyToSend as string))) {
      res.headers?.set('etag', etag)
    }

    // freshness
    // @ts-ignore
    if (req.fresh) res.status = 304

    // strip irrelevant headers
    if (res.status === 204 || res.status === 304) {
      res.headers?.delete('Content-Type')
      res.headers?.delete('Content-Length')
      res.headers?.delete('Transfer-Encoding')
      bodyToSend = ''
    }

    if (req.method === 'HEAD') {
      end(req, res)(body)
      return res
    }

    if (typeof body === 'object') {
      if (body == null) {
        end(req, res)('')
        return res
      } else if (typeof body?.read !== 'undefined') {
        if (!res.headers?.get('Content-Type')) req.headers.set('content-type', 'application/octet-stream')

        end(req, res)(body)
      } else {
        json(req, res)(bodyToSend)
      }
    } else {
      if (typeof bodyToSend !== 'string') bodyToSend = (bodyToSend as string).toString()

      end(req, res)(body)
    }

    return res
  }
