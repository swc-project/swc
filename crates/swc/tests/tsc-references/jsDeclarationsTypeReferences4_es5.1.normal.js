// @filename: index.js
/// <reference types="node" />
export var Something = 2; // to show conflict that can occur
// @ts-ignore
export var A;
(function(A1) {
    var B;
    (function(B) {
        var Something1 = require("fs").Something;
        var thing = new Something1();
    })(B = A1.B || (A1.B = {
    }));
})(A || (A = {
}));
