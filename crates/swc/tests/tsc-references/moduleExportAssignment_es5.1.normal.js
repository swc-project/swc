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
var EE = // @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: npmlog.js
/*#__PURE__*/ function() {
    "use strict";
    function EE() {
        _classCallCheck(this, EE);
    }
    _createClass(EE, [
        {
            /** @param {string} s */ key: "on",
            value: function on(s) {
            }
        }
    ]);
    return EE;
}();
var npmlog = module.exports = new EE();
npmlog.on('hi') // both references should see EE.on
;
module.exports.on('hi') // here too
;
npmlog.x = 1;
module.exports.y = 2;
npmlog.y;
module.exports.x;
// @Filename: use.js
var npmlog = require('./npmlog');
npmlog.x;
npmlog.on;
