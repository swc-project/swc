var STRING, M1, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
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
!function(M) {
    var n;
    M.n = n;
}(M1 || (M1 = {
}));
var objA = new A();
void 0 === STRING || _typeof(STRING), _typeof(""), _typeof({
    x: "",
    y: ""
}), _typeof({
    x: "",
    y: function(s) {
        return s;
    }
}), _typeof(objA.a), _typeof(M1.n), _typeof(""), _typeof(foo()), _typeof(A.foo()), _typeof(STRING + STRING), _typeof(STRING.charAt(0)), _typeof(void 0 === STRING ? "undefined" : _typeof(STRING)), _typeof(_typeof(_typeof(STRING + STRING))), _typeof(""), void 0 === STRING || _typeof(STRING), _typeof(foo()), _typeof(objA.a), M1.n;
z: void 0 === STRING || _typeof(STRING);
x: ;
r: ;
z: _typeof("");
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M1.n);
