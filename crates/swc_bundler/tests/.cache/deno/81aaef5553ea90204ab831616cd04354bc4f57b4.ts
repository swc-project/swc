// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/end.ts


import { Req, Res } from '../../deps.ts'

export const end = <Request extends Req = Req, Response extends Res = Res>(req: Request, res: Response) => (
  body: string | Uint8Array | Deno.Reader | undefined = ''
) => {
  req.respond({ ...res, body })
  return res
}
