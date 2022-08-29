//// [taggedTemplateStringsWithOverloadResolution1_ES6.ts]
function foo(...stuff) {}
foo([]), foo([], 1), foo([], 1, 2), foo([], 1, !0), foo([], 1, "2"), foo([], 1, 2, 3), foo``, foo`${1}`, foo`${1}${2}`, foo`${1}${!0}`, foo`${1}${"2"}`, foo`${1}${2}${3}`;
