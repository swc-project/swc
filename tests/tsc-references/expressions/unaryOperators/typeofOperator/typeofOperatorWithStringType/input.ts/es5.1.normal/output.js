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
// typeof  operator on string type
var STRING;
var STRING1 = [
    "",
    "abc"
];
function foo() {
    return "abc";
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
                return "";
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
// string type var
var ResultIsString1 = typeof STRING === "undefined" ? "undefined" : _typeof(STRING);
var ResultIsString2 = typeof STRING1 === "undefined" ? "undefined" : _typeof(STRING1);
// string type literal
var ResultIsString3 = _typeof("");
var ResultIsString4 = _typeof({
    x: "",
    y: ""
});
var ResultIsString5 = _typeof({
    x: "",
    y: function(s) {
        return s;
    }
});
// string type expressions
var ResultIsString6 = _typeof(objA.a);
var ResultIsString7 = _typeof(M1.n);
var ResultIsString8 = _typeof(STRING1[0]);
var ResultIsString9 = _typeof(foo());
var ResultIsString10 = _typeof(A.foo());
var ResultIsString11 = _typeof(STRING + STRING);
var ResultIsString12 = _typeof(STRING.charAt(0));
// multiple typeof  operators
var ResultIsString13 = _typeof(typeof STRING === "undefined" ? "undefined" : _typeof(STRING));
var ResultIsString14 = _typeof(_typeof(_typeof(STRING + STRING)));
// miss assignment operators
_typeof("");
typeof STRING === "undefined" ? "undefined" : _typeof(STRING);
typeof STRING1 === "undefined" ? "undefined" : _typeof(STRING1);
_typeof(foo());
_typeof(objA.a), M1.n;
// use typeof in type query
var z;
var x;
var r;
z: typeof STRING === "undefined" ? "undefined" : _typeof(STRING);
x: typeof STRING1 === "undefined" ? "undefined" : _typeof(STRING1);
r: typeof foo === "undefined" ? "undefined" : _typeof(foo);
var y = {
    a: "",
    b: ""
};
z: _typeof(y.a);
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M1.n);
