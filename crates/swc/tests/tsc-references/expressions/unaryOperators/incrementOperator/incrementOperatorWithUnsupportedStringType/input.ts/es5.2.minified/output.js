var STRING, M1, STRING1 = [
    "",
    ""
];
function foo() {
    return "";
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
++STRING, ++STRING1, STRING++, STRING1++, ++"", ++{
    x: "",
    y: ""
}, ++{
    x: "",
    y: function(s) {
        return s;
    }
}, ""++, {
    x: "",
    y: ""
}++, {
    x: "",
    y: function(s) {
        return s;
    }
}++, ++objA.a, ++M1.n, ++STRING1[0], ++foo(), ++A.foo(), ++STRING + STRING, objA.a++, M1.n++, STRING1[0]++, foo()++, A.foo()++, STRING + STRING++, ++"", ++STRING, ++STRING1, ++STRING1[0], ++foo(), ++objA.a, ++M1.n, ++objA.a, M1.n, ""++, STRING++, STRING1++, STRING1[0]++, foo()++, objA.a++, M1.n++, objA.a++, M1.n++;
