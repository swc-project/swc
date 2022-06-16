"use strict";
const a = ()=>42;
const b = (a)=>({
        val: a
    });
const c = (c = b(a()))=>{
    c.val === 42 && pass();
};
c();
