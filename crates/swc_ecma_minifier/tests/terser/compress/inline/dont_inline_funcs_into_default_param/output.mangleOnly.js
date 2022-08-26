"use strict";
const t = (t)=>({
        val: t
    });
const c = function(c = t(id("PASS"))) {
    console.log(c.val);
};
c();
