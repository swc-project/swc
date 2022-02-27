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
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
C.f = 1;
C.arrowFunctionBoundary = function() {
    return C.f + 1;
};
C.functionExprBoundary = function() {
    return this.f + 2;
};
C.classExprBoundary = function _class() {
    "use strict";
    _classCallCheck(this, _class);
    this.a = this.f + 3;
};
C.functionAndClassDeclBoundary = (function() {
    var foo = function foo() {
        return this.f + 4;
    };
    var CC = /*#__PURE__*/ function() {
        "use strict";
        function CC() {
            _classCallCheck(this, CC);
            this.a = this.f + 5;
        }
        _createClass(CC, [
            {
                key: "method",
                value: function method() {
                    return this.f + 6;
                }
            }
        ]);
        return CC;
    }();
})();
