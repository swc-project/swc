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
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
var Foo2 = function Foo2() {
    "use strict";
    _classCallCheck(this, Foo2);
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            // Computed properties
            key: "",
            value: function value() {
                return new Foo;
            }
        },
        {
            key: "",
            value: function value() {
                return new Foo2;
            }
        }
    ]);
    return C;
}();
