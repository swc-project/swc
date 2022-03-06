import * as swcHelpers from "@swc/helpers";
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
    swcHelpers.classCallCheck(this, C);
    this.x = function() {
        var q;
        var q = this;
    };
    this.y = function ff() {
        var q;
        var q = this;
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
})(M || (M = {}));
