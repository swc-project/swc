"use strict";
const t = ()=>42;
const c = (s)=>({
        val: s
    });
const s = (s = c(t()))=>{
    s.val === 42 && pass();
};
s();
