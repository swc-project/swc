import { c as _c } from "react/compiler-runtime";
import * as React from "react";
export function Counter() {
    "use memo";
    var $ = _c(1);
    // This callback captures no local variables (only the `console` global), so
    // it is safe to outline into a top-level helper when outlining is enabled.
    var onClick = _temp;
    var t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ React.createElement("button", {
            onClick: onClick
        });
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
function _temp() {
    console.log("clicked");
}
