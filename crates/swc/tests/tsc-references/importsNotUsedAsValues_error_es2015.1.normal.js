class _class {
}
// @importsNotUsedAsValues: error
// @noUnusedLocals: true
// @Filename: /a.ts
export { _class as default };
export class A {
}
export var C;
(function(C) {
    C[C["One"] = 0] = "One";
    C[C["Two"] = 1] = "Two";
})(C || (C = {}));
let a;
let b;
console.log(a, b);
let a;
let b;
console.log(a, b);
const a = A;
let b;
console.log(a, b);
0;
let c = 1;
let d = 1;
console.log(c, d);
let c;
let d;
console.log(c, d);
// @Filename: /h.ts
class H {
}
module.exports = H;
// @Filename: /i.ts
const H = require('./h'); // Error
let h = {};
console.log(h);
// @Filename: /j.ts
const H = require('./h'); // noUnusedLocals error only
var // @Filename: /k.ts
K;
(function(K) {
    K[K["One"] = 0] = "One";
    K[K["Two"] = 1] = "Two";
})(K || (K = {}));
module.exports = K;
// @Filename: /l.ts
const K = require('./k');
0; // @Filename: /j.ts
 // Sad face https://github.com/microsoft/TypeScript/blob/6b04f5039429b9d412696fe2febe39ecc69ad365/src/testRunner/compilerRunner.ts#L207
