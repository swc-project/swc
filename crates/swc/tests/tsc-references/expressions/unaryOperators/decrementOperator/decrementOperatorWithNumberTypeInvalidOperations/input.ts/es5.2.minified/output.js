var NUMBER, M1, NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
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
                return 1;
            }
        }
    ]), A;
}();
(function(M) {
    var n;
    M.n = n;
})(M1 || (M1 = {
})), new A(), --NUMBER1, NUMBER1--, --1, --{
    x: 1,
    y: 2
}, --{
    x: 1,
    y: function(n) {
        return n;
    }
}, 1--, {
    x: 1,
    y: 2
}--, {
    x: 1,
    y: function(n) {
        return n;
    }
}--, --foo(), --A.foo(), --NUMBER + NUMBER, foo()--, A.foo()--, NUMBER + NUMBER--, --1, --NUMBER1, --foo(), 1--, NUMBER1--, foo()--;
