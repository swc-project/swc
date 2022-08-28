//// [computedPropertyNames12_ES6.ts]
var s;
var n;
var a;
let _n = n, _ref = s + n, _ref1 = `hello ${a} bye`;
class C {
    constructor(){
        this[_n] = n;
        this[_ref] = 2;
        this[`hello bye`] = 0;
    }
}
C[_ref1] = 0;
