import * as swcHelpers from "@swc/helpers";
// @filename: input.js
// @out: output.js
// @allowJs: true
function C() {
    this.m = null;
}
C.prototype.m = function() {
    this.nothing();
};
var X = /*#__PURE__*/ function() {
    "use strict";
    function X() {
        swcHelpers.classCallCheck(this, X);
        this.m = this.m.bind(this);
        this.mistake = 'frankly, complete nonsense';
    }
    swcHelpers.createClass(X, [
        {
            key: "m",
            value: function m() {}
        },
        {
            key: "mistake",
            value: function mistake() {}
        }
    ]);
    return X;
}();
var x = new X();
X.prototype.mistake = false;
x.m();
x.mistake;
var Y = /*#__PURE__*/ function() {
    "use strict";
    function Y() {
        swcHelpers.classCallCheck(this, Y);
        this.m = this.m.bind(this);
        this.mistake = 'even more nonsense';
    }
    swcHelpers.createClass(Y, [
        {
            key: "mistake",
            value: function mistake() {}
        },
        {
            key: "m",
            value: function m() {}
        }
    ]);
    return Y;
}();
Y.prototype.mistake = true;
var y = new Y();
y.m();
y.mistake();
