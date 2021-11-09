function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var i1, Foo = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Foo() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Foo);
    }
    return protoProps = [
        {
            key: "y",
            value: function() {
            }
        },
        {
            key: "Z",
            get: function() {
                return 1;
            }
        }
    ], _defineProperties((Constructor = Foo).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Foo;
}();
i1.x, i1.y(), i1.Z, i1 = i1;
