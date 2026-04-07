import { c as _c } from "react/compiler-runtime";
import { useState } from "react";
export function useCounter() {
    const $ = _c(2);
    const [count, setCount] = useState(0);
    let t0;
    if ($[0] !== count) {
        (t0 = {
            count,
            setCount
        });
        ($[0] = count);
        ($[1] = t0);
    } else {
        (t0 = $[1]);
    }
    return t0;
}
