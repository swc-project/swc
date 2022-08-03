"use strict";
const n = (n)=>({
        val: n
    });
const o = function(o = n(id("PASS"))) {
    console.log(o.val);
};
o();
