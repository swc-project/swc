import { c as _c } from "react/compiler-runtime";
import { useHook } from "x";
export function C(t0) {
    const $ = _c(7);
    const { items } = t0;
    const f = _temp;
    const x_0 = useHook();
    let t1;
    if ($[0] !== items || $[1] !== x_0) {
        t1 = x_0.foo(items);
        $[0] = items;
        $[1] = x_0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const y = t1;
    const t2 = x_0 + items;
    let t3;
    if ($[3] !== t2 || $[4] !== x_0.bar || $[5] !== y) {
        t3 = <div onClick={f}>{y}{t2}{x_0.bar}</div>;
        $[3] = t2;
        $[4] = x_0.bar;
        $[5] = y;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    return t3;
}
function _temp() {
    return 1;
}
