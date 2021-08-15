// Loaded from https://deno.land/x/tinyhttp@0.1.18/onError.ts


import { Request } from './request.ts'
import { NextFunction } from 'https://esm.sh/@tinyhttp/router'
import { ALL as STATUS_CODES } from 'https://deno.land/x/status@0.1.0/codes.ts'
import { status } from 'https://deno.land/x/status@0.1.0/status.ts'

export type ServerError = Partial<{
  code: number
  status: number
  message: string
}>

export type ErrorHandler = (err: ServerError, req: Request, next?: NextFunction) => void

export const onErrorHandler: ErrorHandler = async (err: ServerError, req: Request) => {
  const code = err.code || err.status

  if (typeof err === 'string') {
    await req.respond({
      body: err,
      status: 500
    })
  } else if (STATUS_CODES.includes(code!)) {
    await req.respond({
      body: status.pretty(code!).toString(),
      status: code
    })
  } else {
    req.respond({
      status: 500,
      body: err.message
    })
  }
}
