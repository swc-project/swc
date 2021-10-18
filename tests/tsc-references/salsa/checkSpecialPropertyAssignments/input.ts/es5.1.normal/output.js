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
// @checkJs: true
// @allowJs: true
// @Filename: bug24252.js
var A = {
};
A.B = /*#__PURE__*/ (function() {
    "use strict";
    function _class() {
        _classCallCheck(this, _class);
    }
    _createClass(_class, [
        {
            key: "m",
            value: function m() {
                /** @type {string[]} */ var x = [];
                /** @type {number[]} */ var y;
                y = x;
            }
        }
    ]);
    return _class;
})();
