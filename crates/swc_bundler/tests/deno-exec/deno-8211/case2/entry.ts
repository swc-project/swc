// https://github.com/denoland/deno/issues/8211#issuecomment-736498065

import * as c from "https://deno.land/x/case@v2.1.0/mod.ts";

const s = "one FINE day";
console.log("camel:", c.camelCase(s));