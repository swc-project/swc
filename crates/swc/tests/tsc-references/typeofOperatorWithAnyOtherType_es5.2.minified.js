var ANY, ANY1, obj, M, _typeof = function(obj2) {
    return obj2 && "undefined" != typeof Symbol && obj2.constructor === Symbol ? "symbol" : typeof obj2;
}, ANY2 = [
    "",
    ""
], obj1 = {
    x: "a",
    y: function() {}
};
function foo() {}
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
            value: function() {}
        }
    ]), A;
}();
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var objA = new A();
void 0 === ANY1 || _typeof(ANY1), _typeof(ANY2), _typeof(A), void 0 === M || _typeof(M), void 0 === obj || _typeof(obj), _typeof(obj1), _typeof(null), _typeof({}), _typeof(ANY2[0]), _typeof(objA.a), _typeof(obj1.x), _typeof(M.n), _typeof(foo()), _typeof(A.foo()), _typeof(ANY + ANY1), _typeof(NaN), _typeof(0), _typeof(NaN), _typeof(void 0 === ANY ? "undefined" : _typeof(ANY)), _typeof(_typeof(_typeof(ANY + ANY1))), void 0 === ANY || _typeof(ANY), void 0 === ANY1 || _typeof(ANY1), _typeof(ANY2[0]), void 0 === ANY || _typeof(ANY), _typeof(obj1), _typeof(obj1.x), _typeof(objA.a), _typeof(M.n);
z: void 0 === ANY || _typeof(ANY);
x: _typeof(ANY2);
r: _typeof(foo);
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M.n);
z: _typeof(obj1.x);
