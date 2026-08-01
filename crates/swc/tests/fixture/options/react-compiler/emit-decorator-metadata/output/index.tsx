import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_metadata } from "@swc/helpers/_/_ts_metadata";
import { c as _c } from "react/compiler-runtime";
function dec() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
}
var Service = function Service() {
    "use strict";
    _class_call_check(this, Service);
};
var Controller = function Controller() {
    "use strict";
    _class_call_check(this, Controller);
    _define_property(this, "value", void 0);
};
_ts_decorate([
    dec,
    _ts_metadata("design:type", typeof Service === "undefined" ? Object : Service)
], Controller.prototype, "value", void 0);
export function App() {
    var $ = _c(1);
    var t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ React.createElement("div", null);
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
