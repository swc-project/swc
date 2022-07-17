// @target: es5
import _define_property from "@swc/helpers/src/_define_property.mjs";
function foo() {
    var obj = _define_property({}, this.bar, 0);
}
