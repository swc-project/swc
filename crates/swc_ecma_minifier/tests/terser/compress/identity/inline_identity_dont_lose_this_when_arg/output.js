"use strict";
const func_bag = {
    leak: leak
};
leak(func_bag.leak);
