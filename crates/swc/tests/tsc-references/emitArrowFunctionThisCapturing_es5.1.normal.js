var _this = this;
// @target:es5
var f1 = function() {
    _this.age = 10;
};
var f2 = function(x) {
    _this.name = x;
};
function foo(func) {
}
foo(function() {
    _this.age = 100;
    return true;
});
