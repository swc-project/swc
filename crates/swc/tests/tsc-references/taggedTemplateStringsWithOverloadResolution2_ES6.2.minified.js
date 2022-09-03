//// [taggedTemplateStringsWithOverloadResolution2_ES6.ts]
function foo1(...stuff) {}
var a = foo1`${1}`, b = foo1([], 1);
function foo2(...stuff) {}
var c = foo2`${1}`, d = foo2([], 1);
