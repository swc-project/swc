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
                var receiver, classConstructor, descriptor, receiver, descriptor;
                receiver = x, classConstructor = B, descriptor = _foo1, (function(receiver, classConstructor) {
                    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
                })(receiver, classConstructor), (function(descriptor, action) {
                    if (void 0 === descriptor) throw new TypeError("attempted to get private static field before its declaration");
                })(descriptor, "get"), (descriptor = descriptor).get ? descriptor.get.call(receiver) : descriptor.value;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), B;
}(), _foo1 = {
    writable: !0,
    value: !0
};
