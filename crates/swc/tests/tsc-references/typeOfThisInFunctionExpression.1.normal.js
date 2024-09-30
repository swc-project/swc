//// [typeOfThisInFunctionExpression.ts]
// type of 'this' in FunctionExpression is Any
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
    _class_call_check(this, C);
    this.x = function() {
        var q;
        var q = this;
    };
    this.y = function ff() {
        var q;
        var q = this;
    };
};
(function(M) {
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
})(M || (M = {}));
var M;
