//// [taggedTemplateStringsWithOverloadResolution3_ES6.ts]
function fn1() {
    return null;
}
var n, s = fn1`${void 0}`;
function fn2() {}
fn1`${{}}`;
var d1 = fn2`${0}${void 0}`, d2 = fn2`${0}${void 0}`;
function fn3() {
    return null;
}
d1.foo(), d2(), fn2`${0}${''}`, fn2`${''}${0}`;
var s = fn3`${3}`, s = fn3`${''}${3}${''}`, n = fn3`${5}${5}${5}`, s = fn3`${4}`, s = fn3`${''}${''}${''}`, n = fn3`${''}${''}${3}`;
function fn4() {}
function fn5() {}
fn3``, fn4`${''}${3}`, fn4`${3}${''}`, fn4`${3}${void 0}`, fn4`${''}${null}`, fn4`${null}${null}`, fn4`${!0}${null}`, fn4`${null}${!0}`, fn5`${(n)=>n.toFixed()}`, fn5`${(n)=>n.substr(0)}`;
