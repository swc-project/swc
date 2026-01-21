//// [deleteOperatorWithStringType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var STRING, M, A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return "";
    }, A;
}();
M || (M = {});
var objA = new A();
delete "", delete {
    x: "",
    y: ""
}, delete {
    x: "",
    y: function(s) {
        return s;
    }
}, delete objA.a, delete M.n, delete [
    "",
    "abc"
][0], delete "abc", delete A.foo(), delete STRING.charAt(0), delete "", delete "abc", delete objA.a, M.n;
