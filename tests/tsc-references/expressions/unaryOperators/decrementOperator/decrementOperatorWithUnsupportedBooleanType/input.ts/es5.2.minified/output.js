function foo() {
    return !0;
}
var BOOLEAN, M1, A = function() {
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
                return !0;
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
--BOOLEAN, BOOLEAN--, --!0, --{
    x: !0,
    y: !1
}, --{
    x: !0,
    y: function(n) {
        return n;
    }
}, !0--, {
    x: !0,
    y: !1
}--, {
    x: !0,
    y: function(n) {
        return n;
    }
}--, --objA.a, --M1.n, --foo(), --A.foo(), foo()--, A.foo()--, objA.a--, M1.n--, --!0, --BOOLEAN, --foo(), --objA.a, --M1.n, --objA.a, M1.n, !0--, BOOLEAN--, foo()--, objA.a--, M1.n--, objA.a--, M1.n--;
