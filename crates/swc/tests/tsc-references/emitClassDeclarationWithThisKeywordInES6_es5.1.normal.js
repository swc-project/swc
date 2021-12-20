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
        this.x = 10;
        this.x = 10;
    }
    _createClass(B, [
        {
            key: "foo",
            value: function foo() {
                B.log(this.x);
            }
        },
        {
            key: "X",
            get: function get() {
                return this.x;
            }
        },
        {
            key: "bX",
            set: function set(y) {
                this.x = y;
            }
        }
    ], [
        {
            key: "log",
            value: function log(a) {
            }
        }
    ]);
    return B;
}();
