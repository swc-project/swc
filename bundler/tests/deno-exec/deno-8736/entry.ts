import { assert } from "https://deno.land/std@0.79.0/_util/assert.ts";

const TEST = undefined

assert(!TEST, 'TEST must not be defined!')

console.log(`Test is ${TEST}`)