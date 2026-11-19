import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { c as _c } from "react/compiler-runtime";
import { useState } from "react";
// Calls a hook conditionally and carries no ESLint suppression comment, so only
// the hooks-usage validation can make the compiler skip it.
export function Toggle(t0) {
    var $ = _c(5);
    var enabled = t0.enabled;
    if (enabled) {
        var _useState = _sliced_to_array(useState(false), 2), on = _useState[0], setOn = _useState[1];
        var t1;
        if ($[0] !== on) {
            t1 = function t1() {
                return setOn(!on);
            };
            $[0] = on;
            $[1] = t1;
        } else {
            t1 = $[1];
        }
        var t2 = String(on);
        var t3;
        if ($[2] !== t1 || $[3] !== t2) {
            t3 = /*#__PURE__*/ React.createElement("button", {
                onClick: t1
            }, t2);
            $[2] = t1;
            $[3] = t2;
            $[4] = t3;
        } else {
            t3 = $[4];
        }
        return t3;
    }
    return null;
}
