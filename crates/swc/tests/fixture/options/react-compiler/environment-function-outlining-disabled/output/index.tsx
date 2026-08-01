import { c as _c } from "react/compiler-runtime";
import * as React from "react";
export function Counter() {
    "use memo";
    var $ = _c(2);
    var t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = function t0() {
            console.log("clicked");
        };
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    var onClick = t0;
    var t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ React.createElement("button", {
            onClick: onClick
        });
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    return t1;
}
