// Loaded from https://deno.land/x/once/index.js


/// <reference types="./index.d.ts" />

/**
 * Create a function that calls and cache a function once
 * @template Return
 * @param {() => Return} fn Function to be invoked once
 * @returns {() => Return} Function that returns result of first-time execution of `fn`
 *
 * @example
 *   import once from 'https://ksxgithub.github.io/deno-once/index.js'
 *   const ran = once(Math.random)
 *   console.log(ran() === ran()) // => true
 */
export function once (fn) {
  let main = () => {
    const value = fn()
    main = () => value
    return value
  }
  return () => main()
}

export default once
