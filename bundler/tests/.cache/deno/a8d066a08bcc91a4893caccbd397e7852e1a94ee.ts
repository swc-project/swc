// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/req/headers.ts


import { Req, Res, parseRange, ParseRangeOptions } from '../../deps.ts'
import fresh from 'https://deno.land/x/fresh@v1.0.0/mod.ts'
import { is } from 'https://deno.land/x/type_is@1.0.3/mod.ts'

export const getRequestHeader = <Request extends Req = Req>(req: Request) => (header: string) => {
  const lc = header.toLowerCase()

  switch (lc) {
    case 'referer':
    case 'referrer':
      return (req.headers.get('referrer') as string) || (req.headers.get('referer') as string)
    default:
      return req.headers.get(lc) as string
  }
}
export const getRangeFromHeader = <Request extends Req = Req>(req: Request) => (
  size: number,
  options?: ParseRangeOptions
) => {
  const range = getRequestHeader(req)('Range')

  if (!range) return

  return parseRange(size, range, options)
}

export const getFreshOrStale = <Request extends Req = Req, Response extends Res = Res>(req: Request, res: Response) => {
  const method = req.method
  const status = res.status || 200

  // GET or HEAD for weak freshness validation only
  if (method !== 'GET' && method !== 'HEAD') return false

  // 2xx or 304 as per rfc2616 14.26
  if ((status >= 200 && status < 300) || 304 === status) {
    return fresh(
      req.headers,
      new Headers({
        etag: res.headers.get('ETag')!,
        'last-modified': res.headers.get('Last-Modified')!
      })
    )
  }

  return false
}

export const checkIfXMLHttpRequest = <Request extends Req = Req>(req: Request) =>
  req.headers?.get('X-Requested-With') === 'XMLHttpRequest'

export const reqIs = <Request extends Req = Req>(req: Request) => (...types: string[]) =>
  is(req.headers?.get('content-type') as string, types)
