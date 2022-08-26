"use strict";
const s = ()=>42;
const t = (s)=>({
        val: s
    });
const c = (c = t(s()))=>{
    c.val === 42 && pass();
};
c();
