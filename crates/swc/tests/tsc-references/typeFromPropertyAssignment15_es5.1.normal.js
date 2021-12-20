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
// @Filename: a.js
var Outer = {
};
Outer.Inner = /*#__PURE__*/ (function() {
    "use strict";
    function _class() {
        _classCallCheck(this, _class);
        this.x = 1;
    }
    _createClass(_class, [
        {
            key: "m",
            value: function m() {
            }
        }
    ]);
    return _class;
})();
/** @type {Outer.Inner} */ var inner;
inner.x;
inner.m();
var inno = new Outer.Inner();
inno.x;
inno.m();
