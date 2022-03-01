function _classNameTDZError(name) {
    throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys.");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _staticProp = (_classNameTDZError("C"), C).staticProp, _staticProp1 = (_classNameTDZError("C"), C).staticProp, _staticProp2 = (_classNameTDZError("C"), C).staticProp, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: _staticProp,
            get: function() {
                return "hello";
            }
        },
        {
            key: _staticProp1,
            set: function(x) {}
        },
        {
            key: _staticProp2,
            value: function() {}
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
C.staticProp = 10;
