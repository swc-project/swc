"use strict";
const id = (x) => x;
const func_bag = { leak: leak };
leak(id(func_bag.leak));
