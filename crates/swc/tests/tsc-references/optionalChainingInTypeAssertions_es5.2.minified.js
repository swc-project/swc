function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var ref, ref1, ref2, ref3, Foo = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Foo() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Foo);
    }
    return protoProps = [
        {
            key: "m",
            value: function() {}
        }
    ], _defineProperties((Constructor = Foo).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Foo;
}(), foo = new Foo();
null === (ref = foo.m) || void 0 === ref || ref(), null === (ref1 = foo.m) || void 0 === ref1 || ref1(), null === (ref2 = foo.m) || void 0 === ref2 || ref2(), null === (ref3 = foo.m) || void 0 === ref3 || ref3();
