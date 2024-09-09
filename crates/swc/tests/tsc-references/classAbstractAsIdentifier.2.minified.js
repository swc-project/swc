//// [classAbstractAsIdentifier.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (/*#__PURE__*/ function() {
    function abstract() {
        _class_call_check(this, abstract);
    }
    return abstract.prototype.foo = function() {
        return 1;
    }, abstract;
}());
