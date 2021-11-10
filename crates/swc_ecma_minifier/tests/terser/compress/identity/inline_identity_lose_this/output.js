"use strict";
const id = (x) => x;
const func_bag = {
    func: function () {
        return void 0 === this ? "PASS" : "FAIL";
    },
};
func_bag.func2 = function () {
    return void 0 === this ? "PASS" : "FAIL";
};
console.log((0, func_bag.func)());
console.log((0, func_bag.func2)());
