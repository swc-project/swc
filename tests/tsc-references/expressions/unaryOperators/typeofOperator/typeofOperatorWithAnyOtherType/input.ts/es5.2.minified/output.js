var ANY, ANY1, obj1, M1, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, ANY2 = [
    "",
    ""
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
void 0 === ANY1 || _typeof(ANY1), void 0 === M1 || _typeof(M1), void 0 === obj1 || _typeof(obj1), _typeof(null), _typeof({
}), _typeof(ANY2[0]), _typeof(objA.a), _typeof("a"), _typeof(M1.n), _typeof(void 0), _typeof(A.foo()), _typeof(ANY + ANY1), _typeof(NaN), _typeof(0), _typeof(NaN), _typeof(void 0 === ANY ? "undefined" : _typeof(ANY)), _typeof(_typeof(_typeof(ANY + ANY1))), void 0 === ANY || _typeof(ANY), void 0 === ANY1 || _typeof(ANY1), _typeof(ANY2[0]), void 0 === ANY || _typeof(ANY), _typeof("a"), _typeof(objA.a), _typeof(M1.n);
z: void 0 === ANY || _typeof(ANY);
x: ;
r: ;
z: _typeof(objA.a);
z: _typeof(A.foo);
z: _typeof(M1.n);
z: _typeof("a");
