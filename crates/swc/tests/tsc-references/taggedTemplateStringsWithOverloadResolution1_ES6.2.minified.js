//// [taggedTemplateStringsWithOverloadResolution1_ES6.ts]
function foo(...stuff) {}
var a = foo([]), b = foo([], 1), c = foo([], 1, 2), d = foo([], 1, !0), e = foo([], 1, "2"), f = foo([], 1, 2, 3), u = foo``, v = foo`${1}`, w = foo`${1}${2}`, x = foo`${1}${!0}`, y = foo`${1}${"2"}`, z = foo`${1}${2}${3}`;
