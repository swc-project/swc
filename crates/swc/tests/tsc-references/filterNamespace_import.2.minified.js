//// [/ns.ts]
var ns;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(ns) {
    ns.Class = function Class() {
        "use strict";
        _class_call_check(this, Class);
    }, ns.Value = "", (ns.nested || (ns.nested = {})).NestedClass = function NestedClass() {
        "use strict";
        _class_call_check(this, NestedClass);
    };
}(ns || (ns = {}));
export default ns;
//// [/a.ts]
ns.Class, ns.Value;
export { };
