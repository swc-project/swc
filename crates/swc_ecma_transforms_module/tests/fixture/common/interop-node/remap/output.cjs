"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.test = exports.f = exports.e = exports.c = exports.a = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    a: ()=>a,
    c: ()=>b,
    e: ()=>d,
    f: ()=>d,
    test: ()=>test
});
var test = 2;
test = 5;
test++;
(function() {
    var test = 2;
    test = 3;
    test++;
})();
var a = 2;
a = 3;
var b = 2;
b = 3;
var d = 3;
d = 4;
