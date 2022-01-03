var STRING, M, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, STRING1 = [
    "",
    "abc"
];
function foo() {
    return "abc";
}
var A = function() {
    "use strict";
    var Constructor;
    function A() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, A);
    }
    return (function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    })(Constructor = A, [
        {
            key: "foo",
            value: function() {
                return "";
            }
        }
    ]), A;
}();
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
void 0 === STRING || _typeof(STRING), _typeof(STRING1), _typeof(""), _typeof({
    x: "",
    y: ""
}), _typeof({
    x: "",
    y: function(s) {
        return s;
    }
}), _typeof(objA.a), _typeof(M.n), _typeof(STRING1[0]), _typeof(foo()), _typeof(A.foo()), _typeof(STRING + STRING), _typeof(STRING.charAt(0)), _typeof(void 0 === STRING ? "undefined" : _typeof(STRING)), _typeof(_typeof(_typeof(STRING + STRING))), _typeof(""), void 0 === STRING || _typeof(STRING), _typeof(STRING1), _typeof(foo()), _typeof(objA.a), M.n;
z: void 0 === STRING || _typeof(STRING);
x: _typeof(STRING1);
r: _typeof(foo);
z: _typeof("");
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M.n);
