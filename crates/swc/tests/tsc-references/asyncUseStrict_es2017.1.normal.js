//// [asyncUseStrict_es2017.ts]
async function func() {
    "use strict";
    var b = await p || a;
}
