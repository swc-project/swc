"use strict";
const n = (n)=>n;
const t = {
    func: function() {
        return this === undefined ? "PASS" : "FAIL";
    }
};
t.func2 = function() {
    return this === undefined ? "PASS" : "FAIL";
};
console.log(n(t.func)());
console.log(n(t.func2)());
