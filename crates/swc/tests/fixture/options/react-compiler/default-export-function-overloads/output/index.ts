import { c as _c } from "react/compiler-runtime";
export default function useResponse(value, transform) {
    var $ = _c(3);
    var t0;
    if ($[0] !== transform || $[1] !== value) {
        t0 = transform ? transform(value) : value;
        $[0] = transform;
        $[1] = value;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
}
