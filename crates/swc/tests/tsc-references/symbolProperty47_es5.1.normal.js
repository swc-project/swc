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
var _hasInstance = Symbol.hasInstance, _hasInstance1 = Symbol.hasInstance;
var C = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: _hasInstance,
            get: function get() {
                return "";
            }
        },
        {
            key: _hasInstance1,
            set: // Should take a string
            function set(x) {}
        }
    ]);
    return C;
}();
(new C)[Symbol.hasInstance] = 0;
(new C)[Symbol.hasInstance] = "";
