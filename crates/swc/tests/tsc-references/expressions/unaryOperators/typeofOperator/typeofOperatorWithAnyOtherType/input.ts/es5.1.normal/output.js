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
// typeof  operator on any type
var ANY;
var ANY1;
var ANY2 = [
    "",
    ""
];
var obj2;
var obj1 = {
    x: "a",
    y: function() {
    }
};
function foo() {
    var a;
    return a;
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
                var a;
                return a;
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
// any type var
var ResultIsString1 = typeof ANY1 === "undefined" ? "undefined" : _typeof(ANY1);
var ResultIsString2 = typeof ANY2 === "undefined" ? "undefined" : _typeof(ANY2);
var ResultIsString3 = typeof A === "undefined" ? "undefined" : _typeof(A);
var ResultIsString4 = typeof M1 === "undefined" ? "undefined" : _typeof(M1);
var ResultIsString5 = typeof obj2 === "undefined" ? "undefined" : _typeof(obj2);
var ResultIsString6 = typeof obj1 === "undefined" ? "undefined" : _typeof(obj1);
// any type literal
var ResultIsString7 = typeof undefined === "undefined" ? "undefined" : _typeof(undefined);
var ResultIsString8 = _typeof(null);
var ResultIsString9 = _typeof({
});
// any type expressions
var ResultIsString10 = _typeof(ANY2[0]);
var ResultIsString11 = _typeof(objA.a);
var ResultIsString12 = _typeof(obj1.x);
var ResultIsString13 = _typeof(M1.n);
var ResultIsString14 = _typeof(foo());
var ResultIsString15 = _typeof(A.foo());
var ResultIsString16 = _typeof(ANY + ANY1);
var ResultIsString17 = _typeof(null + undefined);
var ResultIsString18 = _typeof(null + null);
var ResultIsString19 = _typeof(undefined + undefined);
// multiple typeof  operators
var ResultIsString20 = _typeof(typeof ANY === "undefined" ? "undefined" : _typeof(ANY));
var ResultIsString21 = _typeof(_typeof(_typeof(ANY + ANY1)));
// miss assignment operators
typeof ANY === "undefined" ? "undefined" : _typeof(ANY);
typeof ANY1 === "undefined" ? "undefined" : _typeof(ANY1);
_typeof(ANY2[0]);
typeof ANY === "undefined" ? "undefined" : _typeof(ANY), ANY1;
typeof obj1 === "undefined" ? "undefined" : _typeof(obj1);
_typeof(obj1.x);
_typeof(objA.a);
_typeof(M1.n);
// use typeof in type query
var z;
var x;
var r;
z: typeof ANY === "undefined" ? "undefined" : _typeof(ANY);
x: typeof ANY2 === "undefined" ? "undefined" : _typeof(ANY2);
r: typeof foo === "undefined" ? "undefined" : _typeof(foo);
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M1.n);
z: _typeof(obj1.x);
