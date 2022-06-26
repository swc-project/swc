"use strict";
const a = (a)=>a;
const b = {
    func: function() {
        return this === undefined ? "PASS" : "FAIL";
    }
};
b.func2 = function() {
    return this === undefined ? "PASS" : "FAIL";
};
console.log(a(b.func)());
console.log(a(b.func2)());
