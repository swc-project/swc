var _this = this, _this1 = this, _this2 = this;
// @target:es5
var f1 = function() {
    _this.age = 10;
};
var f2 = function(x) {
    _this1.name = x;
};
function foo(func) {
}
foo(function() {
    _this2.age = 100;
    return true;
});
