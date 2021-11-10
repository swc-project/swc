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
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
// @allowUnusedLabels: true
// typeof  operator on boolean type
var BOOLEAN;
function foo() {
    return true;
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    _createClass(A, null, [
        {
            key: "foo",
            value: function foo() {
                return false;
            }
        }
    ]);
    return A;
}();
var M1;
(function(M) {
    var n;
    M.n = n;
})(M1 || (M1 = {
}));
var objA = new A();
// boolean type var
var ResultIsString1 = typeof BOOLEAN === "undefined" ? "undefined" : _typeof(BOOLEAN);
// boolean type literal
var ResultIsString2 = _typeof(true);
var ResultIsString3 = _typeof({
    x: true,
    y: false
});
// boolean type expressions
var ResultIsString4 = _typeof(objA.a);
var ResultIsString5 = _typeof(M1.n);
var ResultIsString6 = _typeof(foo());
var ResultIsString7 = _typeof(A.foo());
// multiple typeof  operator
var ResultIsString8 = _typeof(typeof BOOLEAN === "undefined" ? "undefined" : _typeof(BOOLEAN));
// miss assignment operators
_typeof(true);
typeof BOOLEAN === "undefined" ? "undefined" : _typeof(BOOLEAN);
_typeof(foo());
_typeof(true), false;
_typeof(objA.a);
_typeof(M1.n);
// use typeof in type query
var z;
var x;
var r;
z: typeof BOOLEAN === "undefined" ? "undefined" : _typeof(BOOLEAN);
r: typeof foo === "undefined" ? "undefined" : _typeof(foo);
var y = {
    a: true,
    b: false
};
z: _typeof(y.a);
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M1.n);
