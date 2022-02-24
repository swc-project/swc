// @checkjs: true
// @outdir: out/
// @filename: bug39372.js
// @declaration: true
/** @type {XMLObject<{foo:string}>} */ /**
 * @template T
 * @typedef {{
  $A: {
    [K in keyof T]?: XMLObject<T[K]>[]
  },
  $O: {
    [K in keyof T]?: {
      $$?: Record<string, string>
    } & (T[K] extends string ? {$:string} : XMLObject<T[K]>)
  },
  $$?: Record<string, string>,
  } & {
  [K in keyof T]?: (
    T[K] extends string ? string
      : XMLObject<T[K]>
  )
}} XMLObject<T> */ /** @type {XMLObject<{foo:string}>} */ /** @typedef {boolean | number | string | null | JsonRecord | JsonArray | readonly []} Json */ /** @type {XMLObject<{foo:string}>} */ /**
 * @template T
 * @typedef {{
  $A: {
    [K in keyof T]?: XMLObject<T[K]>[]
  },
  $O: {
    [K in keyof T]?: {
      $$?: Record<string, string>
    } & (T[K] extends string ? {$:string} : XMLObject<T[K]>)
  },
  $$?: Record<string, string>,
  } & {
  [K in keyof T]?: (
    T[K] extends string ? string
      : XMLObject<T[K]>
  )
}} XMLObject<T> */ /** @type {XMLObject<{foo:string}>} */ /** @typedef {{ readonly [key: string]: Json }} JsonRecord */ /** @type {XMLObject<{foo:string}>} */ /**
 * @template T
 * @typedef {{
  $A: {
    [K in keyof T]?: XMLObject<T[K]>[]
  },
  $O: {
    [K in keyof T]?: {
      $$?: Record<string, string>
    } & (T[K] extends string ? {$:string} : XMLObject<T[K]>)
  },
  $$?: Record<string, string>,
  } & {
  [K in keyof T]?: (
    T[K] extends string ? string
      : XMLObject<T[K]>
  )
}} XMLObject<T> */ /** @type {XMLObject<{foo:string}>} */ /** @typedef {boolean | number | string | null | JsonRecord | JsonArray | readonly []} Json */ /** @type {XMLObject<{foo:string}>} */ /**
 * @template T
 * @typedef {{
  $A: {
    [K in keyof T]?: XMLObject<T[K]>[]
  },
  $O: {
    [K in keyof T]?: {
      $$?: Record<string, string>
    } & (T[K] extends string ? {$:string} : XMLObject<T[K]>)
  },
  $$?: Record<string, string>,
  } & {
  [K in keyof T]?: (
    T[K] extends string ? string
      : XMLObject<T[K]>
  )
}} XMLObject<T> */ /** @type {XMLObject<{foo:string}>} */ /** @typedef {ReadonlyArray<Json>} JsonArray */ /** @type {XMLObject<{foo:string}>} */ /**
 * @template T
 * @typedef {{
  $A: {
    [K in keyof T]?: XMLObject<T[K]>[]
  },
  $O: {
    [K in keyof T]?: {
      $$?: Record<string, string>
    } & (T[K] extends string ? {$:string} : XMLObject<T[K]>)
  },
  $$?: Record<string, string>,
  } & {
  [K in keyof T]?: (
    T[K] extends string ? string
      : XMLObject<T[K]>
  )
}} XMLObject<T> */ /** @type {XMLObject<{foo:string}>} */ /** @typedef {boolean | number | string | null | JsonRecord | JsonArray | readonly []} Json */ /** @type {XMLObject<{foo:string}>} */ /**
 * @template T
 * @typedef {{
  $A: {
    [K in keyof T]?: XMLObject<T[K]>[]
  },
  $O: {
    [K in keyof T]?: {
      $$?: Record<string, string>
    } & (T[K] extends string ? {$:string} : XMLObject<T[K]>)
  },
  $$?: Record<string, string>,
  } & {
  [K in keyof T]?: (
    T[K] extends string ? string
      : XMLObject<T[K]>
  )
}} XMLObject<T> */ /** @type {XMLObject<{foo:string}>} */ /** @typedef {{ readonly [key: string]: Json }} JsonRecord */ /** @type {XMLObject<{foo:string}>} */ /**
 * @template T
 * @typedef {{
  $A: {
    [K in keyof T]?: XMLObject<T[K]>[]
  },
  $O: {
    [K in keyof T]?: {
      $$?: Record<string, string>
    } & (T[K] extends string ? {$:string} : XMLObject<T[K]>)
  },
  $$?: Record<string, string>,
  } & {
  [K in keyof T]?: (
    T[K] extends string ? string
      : XMLObject<T[K]>
  )
}} XMLObject<T> */ /** @type {XMLObject<{foo:string}>} */ /** @typedef {boolean | number | string | null | JsonRecord | JsonArray | readonly []} Json */ /** @type {XMLObject<{foo:string}>} */ /**
 * @template T
 * @typedef {{
  $A: {
    [K in keyof T]?: XMLObject<T[K]>[]
  },
  $O: {
    [K in keyof T]?: {
      $$?: Record<string, string>
    } & (T[K] extends string ? {$:string} : XMLObject<T[K]>)
  },
  $$?: Record<string, string>,
  } & {
  [K in keyof T]?: (
    T[K] extends string ? string
      : XMLObject<T[K]>
  )
}} XMLObject<T> */ /** @type {XMLObject<{foo:string}>} */ var p = {};
