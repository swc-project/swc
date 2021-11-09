function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class = function _class() {
    "use strict";
    _classCallCheck(this, _class);
};
// @importsNotUsedAsValues: error
// @noUnusedLocals: true
// @Filename: /a.ts
export { _class as default };
export var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var C1;
export { C1 as C };
(function(C) {
    C[C["One"] = 0] = "One";
    C[C["Two"] = 1] = "Two";
})(C1 || (C1 = {
}));
var a;
var b;
console.log(a, b);
var a;
var b;
console.log(a, b);
var a = A;
var b;
console.log(a, b);
C1.One;
var c = C1.Two;
var d = C1.Two;
console.log(c, d);
var c;
var d;
console.log(c, d);
var H = function H() {
    "use strict";
    _classCallCheck(this, H);
};
module.exports = H;
// @Filename: /i.ts
var H = require('./h'); // Error
var h = {
};
console.log(h);
// @Filename: /j.ts
var H = require('./h'); // noUnusedLocals error only
var // @Filename: /k.ts
K1;
(function(K) {
    K[K["One"] = 0] = "One";
    K[K["Two"] = 1] = "Two";
})(K1 || (K1 = {
}));
module.exports = K1;
// @Filename: /l.ts
var K1 = require('./k');
K1.One; // @Filename: /j.ts
 // Sad face https://github.com/microsoft/TypeScript/blob/6b04f5039429b9d412696fe2febe39ecc69ad365/src/testRunner/compilerRunner.ts#L207
