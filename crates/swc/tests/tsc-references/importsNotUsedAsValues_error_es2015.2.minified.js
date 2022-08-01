export default class {
};
export class A {
}
export var C;
!function(C) {
    C[C.One = 0] = "One", C[C.Two = 1] = "Two";
}(C || (C = {}));
let a, b;
console.log(a, b);
export { };
let a, b;
console.log(a, b);
export { };
import { A } from './a';
let b;
console.log(A, b);
export { };
import { C } from './a';
C.One;
let c = C.Two, d = C.Two;
console.log(c, d);
let c, d;
console.log(c, d);
export { };
module.exports = class {
};
export { };
require('./h'), console.log({});
export { };
require('./h');
export { };
var K;
!function(K) {
    K[K.One = 0] = "One", K[K.Two = 1] = "Two";
}(K || (K = {})), module.exports = K;
export { };
let K = require('./k');
K.One;
export { };
