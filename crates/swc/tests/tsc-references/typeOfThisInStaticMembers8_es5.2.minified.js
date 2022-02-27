function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    "use strict";
    _classCallCheck(this, C);
};
C.f = 1, C.arrowFunctionBoundary = function() {
    return C.f + 1;
}, C.functionExprBoundary = function() {
    return this.f + 2;
}, C.classExprBoundary = function _class() {
    "use strict";
    _classCallCheck(this, _class), this.a = this.f + 3;
}, C.functionAndClassDeclBoundary = (function() {
    var CC = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function CC() {
            _classCallCheck(this, CC), this.a = this.f + 5;
        }
        return protoProps = [
            {
                key: "method",
                value: function() {
                    return this.f + 6;
                }
            }
        ], _defineProperties((Constructor = CC).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), CC;
    }();
})();
