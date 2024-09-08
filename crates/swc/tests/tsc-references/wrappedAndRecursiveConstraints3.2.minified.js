//// [wrappedAndRecursiveConstraints3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (/*#__PURE__*/ function() {
    function C(x) {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {
        return function(x) {
            return x;
        };
    }, C;
}())({
    length: 2
}).foo({
    length: 3,
    charAt: function(x) {}
})('');
