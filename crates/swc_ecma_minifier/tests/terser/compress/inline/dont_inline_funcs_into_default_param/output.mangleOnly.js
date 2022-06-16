"use strict";
const a = (a)=>({
        val: a
    });
const b = function(b = a(id("PASS"))) {
    console.log(b.val);
};
b();
