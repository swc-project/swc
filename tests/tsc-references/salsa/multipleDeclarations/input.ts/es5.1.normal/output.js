function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
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
        _classCallCheck(this, X);
        this.m = this.m.bind(this);
        this.mistake = 'frankly, complete nonsense';
    }
    _createClass(X, [
        {
            key: "m",
            value: function m() {
            }
        },
        {
            key: "mistake",
            value: function mistake() {
            }
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
        _classCallCheck(this, Y);
        this.m = this.m.bind(this);
        this.mistake = 'even more nonsense';
    }
    _createClass(Y, [
        {
            key: "mistake",
            value: function mistake() {
            }
        },
        {
            key: "m",
            value: function m() {
            }
        }
    ]);
    return Y;
}();
Y.prototype.mistake = true;
var y = new Y();
y.m();
y.mistake();
