// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/redirect.ts


import { NextFunction } from 'https://esm.sh/@tinyhttp/router'
import { formatResponse } from './format.ts'
import { setLocationHeader } from './headers.ts'
import { Req, Res } from '../../deps.ts'
import { status as getStatus } from 'https://deno.land/x/status@0.1.0/status.ts'
import { escapeHtml } from '../../deps.ts'

export const redirect = <
  Request extends Req = Req,
  Response extends Res = Res,
  Next extends NextFunction = NextFunction
>(
  req: Request,
  res: Response,
  next: Next
) => (url: string, status = 302) => {
  let address = url

  let body = ''

  address = setLocationHeader(req, res)(address).headers?.get('Location') as string

  formatResponse(
    req,
    res,
    next
  )({
    text: () => {
      body = getStatus(status) + '. Redirecting to ' + address
    },
    html: () => {
      const u = escapeHtml(address)

      body = `<p>${getStatus(status)}. Redirecting to <a href="${u}">${u}</a></p>`
    }
  })

  res.headers.set('Content-Length', body.length.toString())

  if (req.method === 'HEAD') req.respond({ status })
  else
    req.respond({
      body,
      status,
      ...res
    })

  return res
}
