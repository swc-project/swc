export const CSS_VARS_HELPER = `useCssVars`

export function g(func = `useCssVar`) : void {}

export const F = {
  a: `a`,
  b: [`b`]
} as const

export let GOOD = `useCssV${v}ars`

export const BAD = `useCssV${v}ars`

export let BAD2 = `useCssV${v}ars` as const
