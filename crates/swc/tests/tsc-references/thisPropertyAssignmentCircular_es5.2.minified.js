function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
export var Foo = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Foo() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Foo), this.foo = "Hello";
    }
    return protoProps = [
        {
            key: "slicey",
            value: function() {
                this.foo = this.foo.slice();
            }
        },
        {
            key: "m",
            value: function() {
                this.foo;
            }
        }
    ], _defineProperties((Constructor = Foo).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Foo;
}();
