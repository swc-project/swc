function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _foo = new WeakSet(), C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        var obj, privateSet;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), obj = this, (function(obj, privateCollection) {
            if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
        })(obj, privateSet = _foo), privateSet.add(obj);
    }
    return Constructor = C, protoProps = [
        {
            key: "bar",
            value: function() {
                var receiver, privateMap, value, descriptor, x = (receiver = this, value = 84, descriptor = function(receiver, privateMap, action) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                    return privateMap.get(receiver);
                }(receiver, privateMap = _foo, "set"), function(receiver, descriptor, value) {
                    if (descriptor.set) descriptor.set.call(receiver, value);
                    else {
                        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                        descriptor.value = value;
                    }
                }(receiver, descriptor, value), value);
                console.log(x);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
new C().bar();
