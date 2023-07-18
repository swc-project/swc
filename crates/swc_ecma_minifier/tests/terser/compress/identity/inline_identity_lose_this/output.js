"use strict";
const id = (x)=>x;
const func_bag = {
    func: function() {
        return void 0 === this ? "PASS" : "FAIL";
    }
};
func_bag.func2 = function() {
    return void 0 === this ? "PASS" : "FAIL";
};
var x;
console.log((x = func_bag.func)());
var x1;
console.log((x1 = func_bag.func2)());
