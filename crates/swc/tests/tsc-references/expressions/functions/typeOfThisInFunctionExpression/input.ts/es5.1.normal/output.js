function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// type of 'this' in FunctionExpression is Any
function fn() {
    var p = this;
    var p;
}
var t = function t() {
    var p = this;
    var p;
};
var t2 = function f() {
    var x = this;
    var x;
};
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    var _this = this;
    this.x = function() {
        var q;
        var q = _this;
    };
    this.y = function ff() {
        var q;
        var q = _this;
    };
};
var M;
(function(M) {
    var fn = function fn() {
        var p = this;
        var p;
    };
    var t = function t() {
        var p = this;
        var p;
    };
    var t2 = function f() {
        var x = this;
        var x;
    };
})(M || (M = {
}));
