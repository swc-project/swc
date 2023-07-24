"use strict";
const func_bag = {
    leak: leak
};
var x;
leak(x = func_bag.leak);
