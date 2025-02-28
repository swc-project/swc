"use strict";
const c = (n)=>n;
const n = {
    func: function() {
        return this === undefined ? "PASS" : "FAIL";
    }
};
n.func2 = function() {
    return this === undefined ? "PASS" : "FAIL";
};
console.log(c(n.func)());
console.log(c(n.func2)());
