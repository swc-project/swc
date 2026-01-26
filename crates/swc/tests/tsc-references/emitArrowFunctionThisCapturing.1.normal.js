//// [emitArrowFunctionThisCapturing.ts]
var _this = this;
var f1 = function f1() {
    _this.age = 10;
};
var f2 = function f2(x) {
    _this.name = x;
};
function foo(func) {}
foo(function() {
    _this.age = 100;
    return true;
});
