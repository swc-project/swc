function _defineProperties(target, props) {
    for(var i1 = 0; i1 < props.length; i1++){
        var descriptor = props[i1];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var i, Foo = function() {
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
            value: function() {}
        },
        {
            key: "Z",
            get: function() {
                return 1;
            }
        }
    ], _defineProperties((Constructor = Foo).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Foo;
}();
i.x, i.y(), i.Z;
