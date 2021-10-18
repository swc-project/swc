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
    function B(a) {
        _classCallCheck(this, B);
        this.B = a;
    }
    _createClass(B, [
        {
            key: "foo",
            value: function foo() {
                return this.x;
            }
        },
        {
            key: "BB",
            get: function get() {
                return this.B;
            }
        },
        {
            key: "BBWith",
            set: function set(c) {
                this.B = c;
            }
        }
    ]);
    return B;
}();
