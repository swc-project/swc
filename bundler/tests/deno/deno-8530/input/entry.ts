import Head from "https://deno.land/x/aleph/head.ts"
import * as Head2 from "https://deno.land/x/aleph/head.ts"
console.log(Head, Head2);
if (typeof Head !== 'function') {
    throw new Error()
}
if (typeof Head2 !== 'object') {
    throw new Error()
}