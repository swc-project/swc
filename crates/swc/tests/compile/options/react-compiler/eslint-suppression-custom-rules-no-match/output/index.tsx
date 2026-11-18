import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { c as _c } from "react/compiler-runtime";
import { useEffect, useState } from "react";
export function Counter(t0) {
    var $ = _c(6);
    var step = t0.step;
    var _useState = _sliced_to_array(useState(0), 2), count = _useState[0], setCount = _useState[1];
    var t1;
    if ($[0] !== step) {
        t1 = function t1() {
            setCount(function(c) {
                return c + step;
            });
        };
        $[0] = step;
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    var t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [];
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    useEffect(t1, t2);
    var t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = function t3() {
            return setCount(_temp);
        };
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    var t4;
    if ($[4] !== count) {
        t4 = /*#__PURE__*/ React.createElement("button", {
            onClick: t3
        }, count);
        $[4] = count;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    return t4;
}
function _temp(c_0) {
    return c_0 + 1;
}
