"use strict";
var A;
(function(A) {
    var v = A.v = 25;
    function a() {
        console.log(v);
    }
    A.a = a;
})(A || (A = {}));
