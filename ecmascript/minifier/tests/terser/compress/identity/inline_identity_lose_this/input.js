"use strict";
const id = (x) => x;
const func_bag = {
    func: function () {
        return this === undefined ? "PASS" : "FAIL";
    },
};
func_bag.func2 = function () {
    return this === undefined ? "PASS" : "FAIL";
};
console.log(id(func_bag.func)());
console.log(id(func_bag.func2)());
