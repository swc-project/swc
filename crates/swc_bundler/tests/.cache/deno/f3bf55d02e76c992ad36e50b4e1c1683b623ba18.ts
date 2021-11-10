// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/utils.ts


import { format, parse } from 'https://deno.land/x/content_type@1.0.1/mod.ts'
import { etag as eTag } from 'https://deno.land/x/opine@1.6.0/src/utils/etag.ts'
import { lookup } from '../../deps.ts'

export const createETag = (body: Parameters<typeof eTag>[0]) => {
  return eTag(body, { weak: true })
}

export function setCharset(type: string, charset: string) {
  const parsed = parse(type)
  if (parsed.parameters) parsed.parameters.charset = charset

  return format(parsed)
}

export const normalizeType = (type: string) =>
  ~type.indexOf('/') ? acceptParams(type) : { value: lookup(type), params: {} }

export function acceptParams(str: string, index?: number) {
  const parts = str.split(/ *; */)
  const ret: {
    value: string
    quality: number
    params: Record<string, string>
    originalIndex?: number
  } = { value: parts[0], quality: 1, params: {}, originalIndex: index }

  for (const part of parts) {
    const pms = part.split(/ *= */)
    if ('q' === pms[0]) ret.quality = parseFloat(pms[1])
    else ret.params[pms[0]] = pms[1]
  }

  return ret
}

export function normalizeTypes(types: string[]) {
  const ret = []

  for (const type of types) {
    ret.push(normalizeType(type))
  }

  return ret
}
