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
// @filename: bug38550.js
export var Clazz = /*#__PURE__*/ function() {
    "use strict";
    function Clazz() {
        _classCallCheck(this, Clazz);
    }
    _createClass(Clazz, [
        {
            /**
   * @param {function(this:Object, ...*):*} functionDeclaration
   */ key: "method",
            value: function method(functionDeclaration) {
            }
        }
    ]);
    return Clazz;
}();
