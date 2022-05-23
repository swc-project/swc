"use strict";
const id = (x) => x;
const func_bag = { leak: leak };
leak(func_bag.leak);
