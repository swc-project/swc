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
// typeof  operator on number type
var NUMBER;
var NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
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
                return 1;
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
// number type var
var ResultIsString1 = typeof NUMBER === "undefined" ? "undefined" : _typeof(NUMBER);
var ResultIsString2 = typeof NUMBER1 === "undefined" ? "undefined" : _typeof(NUMBER1);
// number type literal
var ResultIsString3 = _typeof(1);
var ResultIsString4 = _typeof({
    x: 1,
    y: 2
});
var ResultIsString5 = _typeof({
    x: 1,
    y: function(n) {
        return n;
    }
});
// number type expressions
var ResultIsString6 = _typeof(objA.a);
var ResultIsString7 = _typeof(M1.n);
var ResultIsString8 = _typeof(NUMBER1[0]);
var ResultIsString9 = _typeof(foo());
var ResultIsString10 = _typeof(A.foo());
var ResultIsString11 = _typeof(NUMBER + NUMBER);
// multiple typeof  operators
var ResultIsString12 = _typeof(typeof NUMBER === "undefined" ? "undefined" : _typeof(NUMBER));
var ResultIsString13 = _typeof(_typeof(_typeof(NUMBER + NUMBER)));
// miss assignment operators
_typeof(1);
typeof NUMBER === "undefined" ? "undefined" : _typeof(NUMBER);
typeof NUMBER1 === "undefined" ? "undefined" : _typeof(NUMBER1);
_typeof(foo());
_typeof(objA.a);
_typeof(M1.n);
_typeof(objA.a), M1.n;
// use typeof in type query
var z;
var x;
z: typeof NUMBER === "undefined" ? "undefined" : _typeof(NUMBER);
x: typeof NUMBER1 === "undefined" ? "undefined" : _typeof(NUMBER1);
r: typeof foo === "undefined" ? "undefined" : _typeof(foo);
var y = {
    a: 1,
    b: 2
};
z: _typeof(y.a);
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M1.n);
