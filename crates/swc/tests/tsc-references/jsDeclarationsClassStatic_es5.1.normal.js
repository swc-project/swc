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
var Handler = // @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: source.js
/*#__PURE__*/ function() {
    "use strict";
    function Handler() {
        _classCallCheck(this, Handler);
    }
    _createClass(Handler, [
        {
            key: "process",
            value: function process() {
            }
        }
    ], [
        {
            key: "OPTIONS",
            get: function get() {
                return 1;
            }
        }
    ]);
    return Handler;
}();
Handler.statische = function() {
};
var Strings = {
    a: "A",
    b: "B"
};
module.exports = Handler;
module.exports.Strings = Strings /**
 * @typedef {Object} HandlerOptions
 * @property {String} name
 * Should be able to export a type alias at the same time.
 */ ;
