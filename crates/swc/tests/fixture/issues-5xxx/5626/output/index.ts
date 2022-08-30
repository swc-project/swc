import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
import _ts_metadata from "@swc/helpers/src/_ts_metadata.mjs";
function Prop() {
    return function() {};
}
var Example = function Example() {
    "use strict";
    _class_call_check(this, Example);
};
export { Example as default };
_ts_decorate([
    Prop(),
    _ts_metadata("design:type", typeof BigInt === "undefined" ? Object : BigInt)
], Example.prototype, "prop", void 0);
