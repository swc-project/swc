//// [/ns.ts]
var ns, ns1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(ns1 = ns || (ns = {})).Class = function Class() {
    _class_call_check(this, Class);
}, ns1.Value = "", (ns1.nested || (ns1.nested = {})).NestedClass = function NestedClass() {
    _class_call_check(this, NestedClass);
};
export default ns;
//// [/a.ts]
ns.Class, ns.Value;
export { };
