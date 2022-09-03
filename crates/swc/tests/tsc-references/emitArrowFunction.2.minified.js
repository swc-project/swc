//// [emitArrowFunction.ts]
var f1 = function() {}, f2 = function(x, y) {}, f3 = function(x, y) {
    for(var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)rest[_key - 2] = arguments[_key];
}, f4 = function(x, y) {
    arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
};
function foo(func) {}
foo(function() {
    return !0;
}), foo(function() {
    return !1;
});
