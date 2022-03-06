import * as swcHelpers from "@swc/helpers";
(function() {
    this.m = null;
}).prototype.m = function() {
    this.nothing();
};
var X = function() {
    "use strict";
    function X() {
        swcHelpers.classCallCheck(this, X), this.m = this.m.bind(this), this.mistake = "frankly, complete nonsense";
    }
    return swcHelpers.createClass(X, [
        {
            key: "m",
            value: function() {}
        },
        {
            key: "mistake",
            value: function() {}
        }
    ]), X;
}(), x = new X();
X.prototype.mistake = !1, x.m(), x.mistake;
var Y = function() {
    "use strict";
    function Y() {
        swcHelpers.classCallCheck(this, Y), this.m = this.m.bind(this), this.mistake = "even more nonsense";
    }
    return swcHelpers.createClass(Y, [
        {
            key: "mistake",
            value: function() {}
        },
        {
            key: "m",
            value: function() {}
        }
    ]), Y;
}();
Y.prototype.mistake = !0;
var y = new Y();
y.m(), y.mistake();
