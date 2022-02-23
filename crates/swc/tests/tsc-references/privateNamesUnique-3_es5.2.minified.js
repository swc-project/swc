function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var A = function() {
    "use strict";
    var obj, privateMap, value;
    _classCallCheck(this, A), obj = this, value = {
        writable: !0,
        value: 1
    }, (function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    })(obj, privateMap = _foo), privateMap.set(obj, value);
}, _foo = new WeakMap(), _foo = {
    writable: !0,
    value: !0
}, B = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function B() {
        _classCallCheck(this, B);
    }
    return Constructor = B, protoProps = [
        {
            key: "test",
            value: function(x) {
                !function(receiver, classConstructor, descriptor) {
                    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
                    return descriptor.value;
                }(x, B, _foo1);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), B;
}(), _foo1 = {
    writable: !0,
    value: !0
};
