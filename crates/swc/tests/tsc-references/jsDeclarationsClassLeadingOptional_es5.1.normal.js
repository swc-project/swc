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
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: bar.js
export var Z = /*#__PURE__*/ function() {
    "use strict";
    function Z() {
        _classCallCheck(this, Z);
    }
    _createClass(Z, [
        {
            key: "f",
            value: function f() {
                var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, y = arguments.length > 1 ? arguments[1] : void 0;
                return [
                    x,
                    y
                ];
            }
        }
    ]);
    return Z;
}();
