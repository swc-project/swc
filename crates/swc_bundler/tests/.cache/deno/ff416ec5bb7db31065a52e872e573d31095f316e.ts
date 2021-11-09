// Loaded from https://deno.land/x/tinyhttp@0.1.18/request.ts


// deno-lint-ignore-file
import { ServerRequest } from 'https://deno.land/std@0.101.0/http/server.ts'
import { App } from './app.ts'
import { QueryParams, Ranges, Protocol, AcceptsReturns, Middleware } from './types.ts'

export interface Request<Body = Record<string, unknown>> extends ServerRequest, tinyhttp.Request {
  path: string
  originalUrl: string
  query: QueryParams

  app: App
  params: Record<string, any>
  get: (header: string) => string | string[] | null
  xhr: boolean
  fresh?: boolean
  stale?: boolean
  accepts: (...types: string[]) => AcceptsReturns
  acceptsEncodings: (...encodings: string[]) => AcceptsReturns
  acceptsCharsets: (...charsets: string[]) => AcceptsReturns
  acceptsLanguages: (...languages: string[]) => AcceptsReturns
  range: (size: number, options?: any) => -1 | -2 | Ranges | undefined
  route?: Middleware | undefined
  is: (...types: string[]) => string | boolean

  hostname: string | undefined
  ip?: string
  ips?: string[]
  protocol?: Protocol
  subdomains?: string[]
  secure?: boolean

  cookies?: any
  signedCookies?: any

  connection: {
    remoteAddress: string
  }

  parsedBody?: Body
}
