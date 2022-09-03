//// [emitArrowFunctionThisCapturing.ts]
var _this = this, f1 = function() {
    _this.age = 10;
}, f2 = function(x) {
    _this.name = x;
};
function foo(func) {}
foo(function() {
    return _this.age = 100, !0;
});
