// Loaded from https://deno.land/x/tinyhttp@0.1.18/response.ts


// deno-lint-ignore-file

import { Res as ServerResponse } from './deps.ts'
import type { SendFileOptions } from './extensions/res/send/sendFile.ts'
import type { TemplateEngineOptions, App } from './app.ts'
import type { FormatProps } from './extensions/res/format.ts'
import type { DownloadOptions } from './extensions/res/download.ts'
import { Cookie } from 'https://deno.land/std@0.101.0/http/cookie.ts'

export interface Response<O = any> extends ServerResponse, tinyhttp.Response {
  headers: Headers
  app: App
  send(body: unknown): Response
  sendFile(path: string, options?: SendFileOptions, cb?: (err?: any) => void): Response
  end(body?: unknown): Response
  json(body: unknown): Response
  sendStatus(status: number): Response
  setHeader(
    field: string | Record<string, string | number | string[]>,
    val?: string | number | readonly string[]
  ): Response
  set(field: string | Record<string, string | number | string[]>, val?: string | number | readonly string[]): Response
  location(url: string): Response
  status: number
  get(field: string): string | null | undefined
  append(field: string, value: any): Response
  render(file: string, data?: Record<string, any>, options?: TemplateEngineOptions<O>): Response
  links(links: { [key: string]: string }): Response
  type(type: string): Response
  format(obj: FormatProps): Response
  vary(field: string): Response
  locals: Record<string, any>
  download(path: string, filename: string, options?: DownloadOptions, cb?: (err?: any) => void): Response
  attachment(filename?: string): Response

  cookie(name: string, value: string | Record<string, unknown>, options?: Omit<Cookie, 'name' | 'value'>): Response
  clearCookie(name: string): Response
  jsonp(obj: any): Response

  redirect(url: string, status?: number): Response
}
