// @filename: index.js
/// <reference types="node" />
export var Something = 2; // to show conflict that can occur
// @ts-ignore
export var A;
(function(A) {
    var B;
    (function(B) {
        var Something = require("fs").Something;
        var thing = new Something();
    })(B = A.B || (A.B = {}));
})(A || (A = {}));
