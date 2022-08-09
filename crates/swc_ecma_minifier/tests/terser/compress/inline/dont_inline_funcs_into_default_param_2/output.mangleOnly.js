"use strict";
const c = ()=>42;
const n = (c)=>({
        val: c
    });
const o = (o = n(c()))=>{
    o.val === 42 && pass();
};
o();
