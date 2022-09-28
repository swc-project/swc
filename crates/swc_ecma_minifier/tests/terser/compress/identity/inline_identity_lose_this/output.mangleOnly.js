"use strict";
const n = (n)=>n;
const c = {
    func: function() {
        return this === undefined ? "PASS" : "FAIL";
    }
};
c.func2 = function() {
    return this === undefined ? "PASS" : "FAIL";
};
console.log(n(c.func)());
console.log(n(c.func2)());
