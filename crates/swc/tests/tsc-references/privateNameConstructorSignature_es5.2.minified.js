function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), _x.set(this, {
            writable: !0,
            value: void 0
        });
    }
    return Constructor = C, protoProps = null, staticProps = [
        {
            key: "test",
            value: function() {
                (function(receiver, privateMap, value) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                    var descriptor = privateMap.get(receiver);
                    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                    descriptor.value = 10;
                })(new C(), _x, 10), new new C()().x = 123;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), _x = new WeakMap();
