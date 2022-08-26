"use strict";
const s = (s)=>s;
const t = {
    leak: leak
};
leak(s(t.leak));
