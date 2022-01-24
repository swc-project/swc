var NUMBER, M, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, NUMBER1 = [
    1,
    2
], A = function() {
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
                return 1;
            }
        }
    ]), A;
}();
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
void 0 === NUMBER || _typeof(NUMBER), _typeof(NUMBER1), _typeof(1), _typeof({
    x: 1,
    y: 2
}), _typeof({
    x: 1,
    y: function(n) {
        return n;
    }
}), _typeof(objA.a), _typeof(M.n), _typeof(NUMBER1[0]), _typeof(1), _typeof(A.foo()), _typeof(NUMBER + NUMBER), _typeof(void 0 === NUMBER ? "undefined" : _typeof(NUMBER)), _typeof(_typeof(_typeof(NUMBER + NUMBER))), _typeof(1), void 0 === NUMBER || _typeof(NUMBER), _typeof(NUMBER1), _typeof(1), _typeof(objA.a), _typeof(M.n), _typeof(objA.a), M.n;
z: void 0 === NUMBER || _typeof(NUMBER);
x: _typeof(NUMBER1);
r: _typeof(function() {
    return 1;
});
z: _typeof(1);
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M.n);
