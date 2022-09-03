//// [computedPropertyNames18_ES5.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
function foo() {
    _define_property({}, this.bar, 0);
}
