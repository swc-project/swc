//// [validMultipleVariableDeclarations.ts]
for(var x, p, fn, a, x = 2, x = 3, x = 0;;);
var x = void 0;
function declSpace() {}
var p = {
    x: 1,
    y: 2
}, p = {
    x: 0,
    y: void 0
}, p = {
    x: 1,
    y: void 0
}, p = {
    x: 1,
    y: 2
}, p = {
    x: 0,
    y: void 0
}, fn = function(s) {
    return 42;
}, fn = function(s) {
    return 3;
}, fn = null, a = [
    "a",
    "b"
], a = [], a = [], a = [];
