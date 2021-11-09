function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classNameTDZError(name) {
    throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys.");
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
var tmp = (_classNameTDZError("C"), C).staticProp, tmp1 = (_classNameTDZError("C"), C).staticProp, tmp2 = (_classNameTDZError("C"), C).staticProp;
var C = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: tmp,
            get: function get() {
                return "hello";
            }
        },
        {
            key: tmp1,
            set: function set(x) {
                var y = x;
            }
        },
        {
            key: tmp2,
            value: function value() {
            }
        }
    ]);
    return C;
}();
C.staticProp = 10;
