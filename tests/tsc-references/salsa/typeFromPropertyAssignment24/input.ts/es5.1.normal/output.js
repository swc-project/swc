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
// @Filename: usage.js
// note that usage is first in the compilation
Outer.Inner.Message = function() {
};
var y = new Outer.Inner();
y.name;
/** @type {Outer.Inner} should be instance type, not static type */ var x;
x.name;
// @Filename: def.js
var Outer = {
};
Outer.Inner = /*#__PURE__*/ (function() {
    "use strict";
    function _class() {
        _classCallCheck(this, _class);
    }
    _createClass(_class, [
        {
            key: "name",
            value: function name() {
                return 'hi';
            }
        }
    ]);
    return _class;
})();
