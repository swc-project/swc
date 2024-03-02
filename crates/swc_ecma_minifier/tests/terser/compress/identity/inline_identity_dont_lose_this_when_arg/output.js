"use strict";
const func_bag = {
    leak: leak
};
let x;
leak(x = func_bag.leak);
