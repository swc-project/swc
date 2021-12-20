function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var c, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {
            }
        },
        {
            key: "foo",
            value: function() {
            }
        }
    ], staticProps = [
        {
            key: "b",
            get: function() {
                return null;
            },
            set: function(x) {
            }
        },
        {
            key: "foo",
            value: function() {
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
c.x, c.y, c.y = 1, c.foo(), C.a, C.b(), C.b = 1, C.foo();
