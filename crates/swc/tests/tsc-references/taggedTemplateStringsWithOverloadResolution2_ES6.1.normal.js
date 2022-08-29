//// [taggedTemplateStringsWithOverloadResolution2_ES6.ts]
function foo1(...stuff) {
    return undefined;
}
var a = foo1`${1}`;
var b = foo1([], 1);
function foo2(...stuff) {
    return undefined;
}
var c = foo2`${1}`;
var d = foo2([], 1);
