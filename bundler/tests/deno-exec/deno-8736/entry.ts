import { assert } from "https://deno.land/std@0.79.0/_util/assert.ts";

const TEST = Deno.env.get('TEST')

assert(TEST, 'TEST must be defined!')

console.log(`Test is ${TEST}`)