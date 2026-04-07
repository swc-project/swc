import { isForgetEnabled } from "react-compiler-runtime";
import { c as _c } from "react/compiler-runtime";
import { useState } from "react";
export const Counter = (isForgetEnabled() ? function Counter() {
    const $ = _c(2);
    const [count] = useState(0);
    let t0;
    if ($[0] !== count) {
        (t0 = <span>{count}</span>);
        ($[0] = count);
        ($[1] = t0);
    } else {
        (t0 = $[1]);
    }
    return t0;
} : function Counter() {
    const [count] = useState(0);
    return <span>{count}</span>;
});
