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
    var _proto = X.prototype;
    _proto.m = function m() {};
    _proto.mistake = function mistake() {};
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
    var _proto = Y.prototype;
    _proto.mistake = function mistake() {};
    _proto.m = function m() {};
    return Y;
}();
Y.prototype.mistake = true;
var y = new Y();
y.m();
y.mistake();
