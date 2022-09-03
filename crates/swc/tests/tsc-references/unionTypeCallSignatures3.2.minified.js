//// [unionTypeCallSignatures3.ts]
var fUnion;
function f1(s) {}
function f2(s) {}
function f3() {
    for(var _len = arguments.length, s = Array(_len), _key = 0; _key < _len; _key++)s[_key] = arguments[_key];
}
function f4(s, s2) {}
function f5(s, n) {}
function f6(s) {
    for(var _len = arguments.length, n = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)n[_key - 1] = arguments[_key];
}
function f7(s) {
    for(var _len = arguments.length, sRest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)sRest[_key - 1] = arguments[_key];
}
fUnion("");
