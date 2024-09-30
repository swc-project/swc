//// [nonGenericTypeReferenceWithTypeArguments.ts]
// Check that errors are reported for non-generic types with type arguments
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var E = /*#__PURE__*/ function(E) {
    return E;
}(E || {});
var v1;
var v2;
var v3;
var v4;
function f() {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var E = /*#__PURE__*/ function(E) {
        return E;
    }({});
    var v1;
    var v2;
    var v3;
    var v4;
    var v5;
}
