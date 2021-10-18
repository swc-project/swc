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
var B = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function B() {
        _classCallCheck(this, B);
        this["hello"] = 10;
        this[6] = "world";
        this[10076] = "WORLD";
        this[20] = "twenty";
    }
    _createClass(B, [
        {
            key: "foo",
            value: function foo() {
            }
        },
        {
            key: 14,
            value: function value() {
            }
        },
        {
            key: 11,
            value: function value() {
            }
        },
        {
            key: "interface",
            value: function _interface() {
            }
        }
    ]);
    return B;
}();
B["hi"] = 10000;
B[22] = "twenty-two";
B[5] = "binary";
B[1693] = "octal";
