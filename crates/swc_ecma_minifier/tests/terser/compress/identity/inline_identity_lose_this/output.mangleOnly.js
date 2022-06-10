"use strict";
const b = (a)=>a;
const a = {
    func: function() {
        return this === undefined ? "PASS" : "FAIL";
    }
};
a.func2 = function() {
    return this === undefined ? "PASS" : "FAIL";
};
console.log(b(a.func)());
console.log(b(a.func2)());
