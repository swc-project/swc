// @importsNotUsedAsValues: error
// @noUnusedLocals: true
// @Filename: /a.ts
export default class {
};
export class A {
}
export var C;
(function(C) {
    C[C["One"] = 0] = "One";
    C[C["Two"] = 1] = "Two";
})(C || (C = {}));
// @Filename: /b.ts
let a;
let b;
console.log(a, b);
export { };
// @Filename: /c.ts
let a;
let b;
console.log(a, b);
export { };
// @Filename: /d.ts
import { A } from './a';
const a = A;
let b;
console.log(a, b);
// @Filename: /e.ts
export { }; // noUnusedLocals error only
// @Filename: /f.ts
import { C } from './a';
C.One;
let c = C.Two;
let d = C.Two;
console.log(c, d);
// @Filename: /g.ts
let c;
let d;
console.log(c, d);
export { };
// @Filename: /h.ts
class H {
}
module.exports = H;
export { };
// @Filename: /i.ts
const H = require('./h'); // Error
let h = {};
console.log(h);
export { };
// @Filename: /j.ts
const H = require('./h'); // noUnusedLocals error only
export { };
// @Filename: /k.ts
var K;
(function(K) {
    K[K["One"] = 0] = "One";
    K[K["Two"] = 1] = "Two";
})(K || (K = {}));
module.exports = K;
export { };
// @Filename: /l.ts
const K = require('./k');
K.One;
export { };
// @Filename: /j.ts
// Sad face https://github.com/microsoft/TypeScript/blob/6b04f5039429b9d412696fe2febe39ecc69ad365/src/testRunner/compilerRunner.ts#L207
