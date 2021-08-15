// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/cookie.ts


import { Req, Res } from '../../deps.ts'
import * as cookie from 'https://deno.land/std@0.101.0/http/cookie.ts'

export const setCookie = <Request extends Req = Req, Response extends Res = Res>(req: Request, res: Response) => (
  name: string,
  value: string,
  options?: Omit<cookie.Cookie, 'value' | 'name'>
): Response => {
  cookie.setCookie(req, {
    value,
    name,
    ...options
  })

  return res
}

export const clearCookie = <Response extends Res = Res>(res: Response) => (name: string): Response => {
  cookie.deleteCookie(res, name)

  return res
}
