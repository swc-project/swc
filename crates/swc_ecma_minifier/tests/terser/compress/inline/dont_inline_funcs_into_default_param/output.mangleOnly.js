"use strict";
const b = (a)=>({
        val: a
    });
const a = function(a = b(id("PASS"))) {
    console.log(a.val);
};
a();
