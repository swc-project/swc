"use strict";
const o = (o) => ({ val: o });
const c = function (c = o(id("PASS"))) {
    console.log(c.val);
};
c();
