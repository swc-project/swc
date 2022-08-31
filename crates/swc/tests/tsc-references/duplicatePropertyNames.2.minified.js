//// [duplicatePropertyNames.ts]
var _obj;
import _define_property from "@swc/helpers/src/_define_property.mjs";
_define_property(_obj = {
    foo: ""
}, "foo", ""), _define_property(_obj, "bar", function() {}), _define_property(_obj, "bar", function() {});
