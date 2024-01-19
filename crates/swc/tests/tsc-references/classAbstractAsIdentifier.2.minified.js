//// [classAbstractAsIdentifier.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (function() {
    function abstract() {
        _class_call_check(this, abstract);
    }
    var _proto = abstract.prototype;
    return _proto.foo = function() {
        return 1;
    }, abstract;
}());
