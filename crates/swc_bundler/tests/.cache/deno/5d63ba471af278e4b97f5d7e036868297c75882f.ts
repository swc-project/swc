// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/send/sendStatus.ts


import { Req, Res } from '../../../deps.ts'
import { status } from 'https://deno.land/x/status@0.1.0/status.ts'

export const sendStatus =
  <Request extends Req = Req, Response extends Res = Res>(req: Request, res: Response) =>
  (statusCode: number): Response => {
    req.respond({
      ...res,
      body: status.pretty(statusCode),
      status: statusCode
    })
    return res
  }
