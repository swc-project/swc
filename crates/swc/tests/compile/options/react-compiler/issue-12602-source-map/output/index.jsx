import { c as _c } from "react/compiler-runtime";
export function App(t0) {
    var $ = _c(2);
    var a = t0.a;
    var b = a * 2;
    var t1;
    if ($[0] !== b) {
        t1 = /*#__PURE__*/ React.createElement("div", null, b);
        $[0] = b;
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    return t1;
}
