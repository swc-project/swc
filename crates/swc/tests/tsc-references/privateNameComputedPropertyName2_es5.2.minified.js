function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var getX, tmp = (getX = function(a) {
    var receiver, privateMap, descriptor, receiver, descriptor;
    return (descriptor = descriptor = (function(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver);
    })(receiver = a, privateMap = _x, "get")).get ? descriptor.get.call(receiver) : descriptor.value;
}, "_"), A = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function A() {
        var obj, privateMap, value;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, A), obj = this, value = {
            writable: !0,
            value: 100
        }, (function(obj, privateCollection) {
            if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
        })(obj, privateMap = _x), privateMap.set(obj, value);
    }
    return Constructor = A, protoProps = [
        {
            key: tmp,
            value: function() {}
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}(), _x = new WeakMap();
console.log(getX(new A));
