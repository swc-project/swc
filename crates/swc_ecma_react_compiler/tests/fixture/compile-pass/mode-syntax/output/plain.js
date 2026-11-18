import { c as _c } from "react/compiler-runtime";
export function buildValue(value) {
    "use memo";
    const $ = _c(2);
    let t0;
    if ($[0] !== value) {
        t0 = {
            value
        };
        $[0] = value;
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
