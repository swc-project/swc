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
// @target: es5
var methodName = "method";
var accessorName = "accessor";
var _methodName = methodName, _methodName1 = methodName, _accessorName = accessorName, _accessorName1 = accessorName, _accessorName2 = accessorName, _accessorName3 = accessorName;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: _methodName,
            value: function value() {}
        },
        {
            key: _accessorName,
            get: function get() {}
        },
        {
            key: _accessorName1,
            set: function set(v) {}
        }
    ], [
        {
            key: _methodName1,
            value: function value() {}
        },
        {
            key: _accessorName2,
            get: function get() {}
        },
        {
            key: _accessorName3,
            set: function set(v) {}
        }
    ]);
    return C;
}();
