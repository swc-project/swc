import { c as _c } from "react/compiler-runtime";
export interface MyInterface {
    prop1: string;
    prop2: number;
}
export default interface MyDefaultInterface extends MyInterface {
    prop3: boolean;
    prop4: string;
}
export function App() {
    const $ = _c(1);
    const onClick = _temp;
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <div onClick={onClick}>Click me</div>;
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
function _temp() {
    console.log("Clicked");
}
