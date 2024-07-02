import Head from "https://deno.land/x/aleph@v0.2.28/head.ts";
import * as Head2 from "https://deno.land/x/aleph@v0.2.28/head.ts";
console.log(Head, Head2);
if (typeof Head !== "function") {
    throw new Error();
}
if (typeof Head2 !== "object") {
    throw new Error();
}
