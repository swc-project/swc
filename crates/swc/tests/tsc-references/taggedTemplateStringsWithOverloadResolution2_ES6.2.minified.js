//// [taggedTemplateStringsWithOverloadResolution2_ES6.ts]
function foo1(...stuff) {}
function foo2(...stuff) {}
foo1`${1}`, foo1([], 1), foo2`${1}`, foo2([], 1);
