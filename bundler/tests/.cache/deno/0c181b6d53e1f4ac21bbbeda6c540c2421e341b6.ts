// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/send/json.ts


import { Req, Res } from '../../../deps.ts'

export const json = <Request extends Req = Req, Response extends Res = Res>(req: Request, res: Response) => <
  T = unknown
>(
  body: T
): Response => {
  res.headers?.set('Content-Type', 'application/json')
  if (typeof body === 'object' && body != null) req.respond({ ...res, body: JSON.stringify(body, null, 2) })
  else if (typeof body === 'string') req.respond({ ...res, body })
  else if (body == null) {
    res.headers.delete('Content-Length')
    res.headers.delete('Transfer-Encoding')
    req.respond(res)
  }

  return res
}
