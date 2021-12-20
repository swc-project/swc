function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Foo = function() {
    "use strict";
    _classCallCheck(this, Foo);
}, Foo2 = function() {
    "use strict";
    _classCallCheck(this, Foo2);
}, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        _classCallCheck(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "get1",
            get: function() {
                return new Foo;
            }
        },
        {
            key: "set1",
            set: function(p) {
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
