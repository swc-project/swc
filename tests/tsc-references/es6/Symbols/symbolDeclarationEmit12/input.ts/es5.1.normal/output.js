function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
//@target: ES6
//@declaration: true
var M1;
(function(M) {
    var tmp = Symbol.toPrimitive, tmp1 = Symbol.isConcatSpreadable, tmp2 = Symbol.toPrimitive, tmp3 = Symbol.toPrimitive;
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _classCallCheck(this, C);
        }
        _createClass(C, [
            {
                key: tmp,
                value: function value(x) {
                }
            },
            {
                key: tmp1,
                value: function value() {
                    return undefined;
                }
            },
            {
                key: tmp2,
                get: function get() {
                    return undefined;
                }
            },
            {
                key: tmp3,
                set: function set(x) {
                }
            }
        ]);
        return C;
    }();
    M.C = C;
})(M1 || (M1 = {
}));
