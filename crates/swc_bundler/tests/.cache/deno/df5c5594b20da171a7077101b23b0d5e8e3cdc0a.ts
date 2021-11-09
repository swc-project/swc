// Loaded from https://deno.land/x/tinyhttp@0.1.18/utils/parseUrl.ts


import { parse } from 'https://deno.land/std@0.101.0/node/querystring.ts'

type Regex = {
  keys: string[] | boolean
  pattern: RegExp
}

export const getURLParams = ({ pattern, keys }: Regex, reqUrl = '/'): URLParams => {
  const matches = pattern.exec(reqUrl)

  const params: Record<string, string> = {}

  if (matches && typeof keys !== 'boolean') for (let i = 0; i < keys.length; i++) params[keys[i]] = matches[i + 1]

  return params
}

export type URLParams = {
  [key: string]: string
}

export const getPathname = (u: string) => {
  const end = u.indexOf('?')

  return u.slice(0, end === -1 ? u.length : end)
}

export const getQueryParams = (url = '/'): { [key: string]: string[] | string } =>
  parse(url.slice(url.indexOf('?') + 1))
