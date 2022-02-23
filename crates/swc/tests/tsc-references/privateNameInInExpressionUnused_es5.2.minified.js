function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _brand_check_brand = new WeakSet(), Foo = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Foo() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Foo), _classPrivateFieldInit(this, _unused, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldInit(this, _brand, {
            writable: !0,
            value: void _brand_check_brand.add(this)
        });
    }
    return Constructor = Foo, protoProps = [
        {
            key: "isFoo",
            value: function(v) {
                return _brand_check_brand.has(v);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Foo;
}(), _unused = new WeakMap(), _brand = new WeakMap();
