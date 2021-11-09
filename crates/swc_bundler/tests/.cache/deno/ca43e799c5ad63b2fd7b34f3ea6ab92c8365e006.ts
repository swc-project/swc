// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/download.ts


import { contentDisposition } from 'https://esm.sh/@tinyhttp/content-disposition'
import { SendFileOptions, sendFile } from './send/sendFile.ts'
import { extname } from 'https://deno.land/std@0.101.0/path/mod.ts'
import { setContentType, setHeader } from './headers.ts'
import { Req, Res } from '../../deps.ts'

export type DownloadOptions = SendFileOptions &
  Partial<{
    headers: Record<string, unknown>
  }>

export const download = <Request extends Req = Req, Response extends Res = Res>(req: Request, res: Response) => (
  path: string,
  filename?: string,
  options: DownloadOptions = {}
): Response => {
  const name: string | null = filename as string
  let opts: DownloadOptions = options

  // set Content-Disposition when file is sent
  const headers: Record<string, string> = {
    'Content-Disposition': contentDisposition(name || path)
  }

  // merge user-provided headers
  if (opts.headers) {
    for (const key of Object.keys(opts.headers)) {
      if (key.toLowerCase() !== 'content-disposition') headers[key] = opts.headers[key]
    }
  }

  // merge user-provided options
  opts = { ...opts, headers }

  // send file

  return sendFile<Request, Response>(req, res)(path, opts) as Response
}

export const attachment = <Response extends Res = Res>(res: Response) => (filename?: string): Response => {
  if (filename) setContentType(res)(extname(filename))

  setHeader(res)('Content-Disposition', contentDisposition(filename))

  return res
}
