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
// @allowJs: true
// @checkJs: true
// @strict: true
// @noEmit: true
// @Filename: ex.js
export var Crunch = /*#__PURE__*/ function() {
    "use strict";
    function Crunch(n) {
        _classCallCheck(this, Crunch);
        this.n = n;
    }
    _createClass(Crunch, [
        {
            key: "m",
            value: function m() {
                return this.n;
            }
        }
    ]);
    return Crunch;
}();
// @Filename: use.js
var ex = require('./ex');
// values work
var crunch = new ex.Crunch(1);
crunch.n;
// types work
/**
 * @param {ex.Crunch} wrap
 */ function f(wrap) {
    wrap.n;
}
