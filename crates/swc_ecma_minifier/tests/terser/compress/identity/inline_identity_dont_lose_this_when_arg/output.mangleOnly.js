"use strict";
const a = (a)=>a;
const b = {
    leak: leak
};
leak(a(b.leak));
