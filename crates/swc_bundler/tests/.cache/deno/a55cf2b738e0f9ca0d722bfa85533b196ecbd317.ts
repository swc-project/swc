// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/format.ts


import { Handler, NextFunction } from 'https://esm.sh/@tinyhttp/router'
import { normalizeType, normalizeTypes } from './utils.ts'
import { setVaryHeader } from './headers.ts'
import { getAccepts } from '../req/mod.ts'
import { Req, Res } from '../../deps.ts'

export type FormatProps = {
  default?: () => void
} & Record<string, Handler>

export const formatResponse = <Request extends Req = Req, Response extends Res = Res>(
  req: Request,
  res: Response,
  next: NextFunction
) => (obj: FormatProps) => {
  const fn = obj.default

  if (fn) delete obj.default

  const keys = Object.keys(obj)

  const key = keys.length > 0 ? (getAccepts(req)(...keys) as string) : false

  setVaryHeader(res)('Accept')

  if (key) {
    res.headers?.set('Content-Type', normalizeType(key).value || '')

    obj[key](req, res, next)
  } else if (fn) {
    fn()
  } else {
    const err = new Error('Not Acceptable') as any
    err.status = err.statusCode = 406
    err.types = normalizeTypes(keys).map((o) => o.value)

    next(err)
  }

  return res
}
