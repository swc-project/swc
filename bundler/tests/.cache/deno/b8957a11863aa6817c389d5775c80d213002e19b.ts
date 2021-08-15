// Loaded from https://deno.land/x/tinyhttp@0.1.18/extensions/res/append.ts


import { Res } from '../../deps.ts'
import { setHeader, getResponseHeader } from './headers.ts'

export const append = <Response extends Res = Res>(res: Response) => (
  field: string,
  value: string | number | string[]
): Response => {
  const prevVal = getResponseHeader<Res>(res)(field)
  let newVal = value

  if (prevVal && typeof newVal !== 'number' && typeof prevVal !== 'number') {
    newVal = Array.isArray(prevVal)
      ? prevVal.concat(newVal)
      : Array.isArray(newVal)
      ? [prevVal].concat(newVal)
      : [prevVal, newVal]
  }
  setHeader(res)(field, newVal)
  return res
}
