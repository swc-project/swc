"use strict";
const c = (o)=>({
        val: o
    });
const o = function(o = c(id("PASS"))) {
    console.log(o.val);
};
o();
