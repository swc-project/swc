import { c as _c } from "react/compiler-runtime";
import { useState } from "react";
export function Counter() {
    const $ = _c(2);
    const [count] = useState(0);
    let t0;
    if ($[0] !== count) {
        (t0 = <div>{count}</div>);
        ($[0] = count);
        ($[1] = t0);
    } else {
        (t0 = $[1]);
    }
    return t0;
}
