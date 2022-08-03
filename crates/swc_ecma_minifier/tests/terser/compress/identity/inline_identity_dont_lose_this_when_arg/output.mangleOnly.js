"use strict";
const a = (a)=>a;
const c = {
    leak: leak
};
leak(a(c.leak));
