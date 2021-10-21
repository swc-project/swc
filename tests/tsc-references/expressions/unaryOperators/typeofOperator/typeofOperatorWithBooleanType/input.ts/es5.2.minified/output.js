var BOOLEAN, M1, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function foo() {
    return !0;
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
                return !1;
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
void 0 === BOOLEAN || _typeof(BOOLEAN), _typeof(!0), _typeof({
    x: !0,
    y: !1
}), _typeof(objA.a), _typeof(M1.n), _typeof(foo()), _typeof(A.foo()), _typeof(void 0 === BOOLEAN ? "undefined" : _typeof(BOOLEAN)), _typeof(!0), void 0 === BOOLEAN || _typeof(BOOLEAN), _typeof(foo()), _typeof(!0), _typeof(objA.a), _typeof(M1.n);
z: void 0 === BOOLEAN || _typeof(BOOLEAN);
r: ;
z: _typeof(!0);
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M1.n);
