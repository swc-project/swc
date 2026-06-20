import { c as _c } from "react/compiler-runtime";
type Source = [string];
export function App(props: {
    source: Source;
}) {
    const $ = _c(2);
    let value;
    [value] = props.source;
    let t0;
    if ($[0] !== value) {
        t0 = <div>{value}</div>;
        $[0] = value;
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
