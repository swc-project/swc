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
var _foo = new WeakMap(), _bar = new WeakMap(), A = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function A() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, A), _classPrivateFieldInit(this, _foo, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldInit(this, _bar, {
            writable: !0,
            value: 6
        }), this.qux = 6;
    }
    return protoProps = [
        {
            key: "quux",
            value: function() {}
        }
    ], _defineProperties((Constructor = A).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}();
