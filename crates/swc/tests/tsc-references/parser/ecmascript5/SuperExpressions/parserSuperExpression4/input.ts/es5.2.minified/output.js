function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function set(target, property, value, receiver) {
    return set = "undefined" != typeof Reflect && Reflect.set ? Reflect.set : function set(target, property, value, receiver) {
        var obj, key, value, desc, base = _superPropBase(target, property);
        if (base) {
            if ((desc = Object.getOwnPropertyDescriptor(base, property)).set) return desc.set.call(receiver, value), !0;
            if (!desc.writable) return !1;
        }
        if (desc = Object.getOwnPropertyDescriptor(receiver, property)) {
            if (!desc.writable) return !1;
            desc.value = value, Object.defineProperty(receiver, property, desc);
        } else obj = receiver, value = value, (key = property) in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value;
        return !0;
    }, set(target, property, value, receiver);
}
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "foo",
            value: function() {
                !function(target, property, value, receiver, isStrict) {
                    if (!set(target, property, value, receiver || target) && isStrict) throw new Error("failed to set property");
                    return value;
                }(_getPrototypeOf(C.prototype), "foo", 1, this, !0);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
