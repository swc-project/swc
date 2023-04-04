import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_metadata } from "@swc/helpers/_/_ts_metadata";
function Prop() {
    return function() {};
}
var Example = function Example() {
    "use strict";
    _class_call_check(this, Example);
    _define_property(this, "prop", void 0);
};
export { Example as default };
_ts_decorate([
    Prop(),
    _ts_metadata("design:type", typeof BigInt === "undefined" ? Object : BigInt)
], Example.prototype, "prop", void 0);
