import { c as _c } from "react/compiler-runtime";
import * as React from "react";
function createFoo() {
    function Bar() {
        return "Bar";
    }
    return function Foo() {
        "use memo";
        var $ = _c(2);
        var t0;
        if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
            t0 = function t0() {
                return /*#__PURE__*/ React.createElement(Bar, null);
            };
            $[0] = t0;
        } else {
            t0 = $[0];
        }
        var renderBar = t0;
        var t1;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t1 = renderBar();
            $[1] = t1;
        } else {
            t1 = $[1];
        }
        return t1;
    };
}
