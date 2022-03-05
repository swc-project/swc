function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _iterator = Symbol.iterator, _isConcatSpreadable = Symbol.isConcatSpreadable, _toPrimitive = Symbol.toPrimitive, _toPrimitive1 = Symbol.toPrimitive, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = null, staticProps = [
        {
            key: _isConcatSpreadable,
            value: function() {}
        },
        {
            key: _toPrimitive,
            get: function() {
                return "";
            }
        },
        {
            key: _toPrimitive1,
            set: function(x) {}
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
C[_iterator] = 0;
