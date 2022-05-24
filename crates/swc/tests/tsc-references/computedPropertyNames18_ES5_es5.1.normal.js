import _define_property from "@swc/helpers/lib/_define_property.js";
// @target: es5
function foo() {
    var obj = _define_property({}, this.bar, 0);
}
