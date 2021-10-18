function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var Foo = function() {
    "use strict";
    _classCallCheck(this, Foo);
}, Foo2 = function() {
    "use strict";
    _classCallCheck(this, Foo2);
}, C = function() {
    "use strict";
    var Constructor;
    function C() {
        _classCallCheck(this, C);
    }
    return (function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    })(Constructor = C, [
        {
            key: "",
            value: function() {
                return new Foo;
            }
        }
    ]), C;
}();
