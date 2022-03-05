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
var C1 = // @target: esnext, es2022, es2015
// @useDefineForClassFields: true
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/44113
/*#__PURE__*/ function() {
    "use strict";
    function C1() {
        _classCallCheck(this, C1);
    }
    _createClass(C1, [
        {
            key: "bar",
            value: function value() {}
        }
    ]);
    return C1;
}();
var _qux = {
    writable: true,
    value: 42
};
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    _createClass(C2, null, [
        {
            key: "bar",
            value: function value() {}
        }
    ]);
    return C2;
}();
var _qux1 = {
    writable: true,
    value: 42
};
var C3 = function C3() {
    "use strict";
    _classCallCheck(this, C3);
};
var _qux2 = {
    writable: true,
    value: 42
};
C3["bar"] = "test";
