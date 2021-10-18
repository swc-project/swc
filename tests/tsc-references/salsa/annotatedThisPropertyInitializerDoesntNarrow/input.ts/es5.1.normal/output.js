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
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: Compilation.js
// from webpack/lib/Compilation.js and filed at #26427
/** @param {{ [s: string]: number }} map */ function mappy(map) {
}
export var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        /** @type {{ [assetName: string]: number}} */ this.assets = {
        };
    }
    _createClass(C, [
        {
            key: "m",
            value: function m() {
                mappy(this.assets);
            }
        }
    ]);
    return C;
}();
