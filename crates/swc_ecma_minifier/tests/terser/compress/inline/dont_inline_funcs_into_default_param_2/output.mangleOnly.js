"use strict";
const b = ()=>42;
const c = (a)=>({
        val: a
    });
const a = (a = c(b()))=>{
    a.val === 42 && pass();
};
a();
