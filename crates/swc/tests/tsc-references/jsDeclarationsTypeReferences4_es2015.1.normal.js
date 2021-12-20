// @filename: index.js
/// <reference types="node" />
export const Something = 2; // to show conflict that can occur
// @ts-ignore
export var A;
(function(A1) {
    let B;
    (function(B) {
        const Something1 = require("fs").Something;
        const thing = new Something1();
    })(B = A1.B || (A1.B = {
    }));
})(A || (A = {
}));
