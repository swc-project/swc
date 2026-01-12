//// [node_modules/@types/node/index.d.ts]
//// [index.js]
/// <reference types="node" />
export var Something = 2; // to show conflict that can occur
(function(A) {
    (function(B) {
        var Something = require("fs").Something;
        var thing = new Something();
        B.thing = thing;
    })(A.B || (A.B = {}));
})(A || (A = {}));
export var A;
