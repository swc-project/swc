import { c as _c } from "react/compiler-runtime";
import defer * as a from "a";
import source b from "b";
import c from "c" with {
    type: "json"
};
export function App() {
    const $ = _c(1);
    const onClick = _temp;
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <Home a={a} b={b} c={c} onClick={onClick}>Click me</Home>;
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
function _temp() {
    console.log("Clicked");
}
