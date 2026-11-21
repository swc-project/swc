import { c as _c } from "react/compiler-runtime";
function withNbsp(label) {
    return (<span>
      {label}
      &nbsp;
    </span>);
}
function withSpace(label) {
    return (<span>
      {label}
      &#32;
    </span>);
}
export function Header(t0) {
    const $ = _c(11);
    const { label } = t0;
    let t1;
    if ($[0] !== label) {
        t1 = withNbsp(label);
        $[0] = label;
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== label) {
        t2 = withSpace(label);
        $[2] = label;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== label) {
        t3 = <p>{label}{" &A©<{"}</p>;
        $[4] = label;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = <b>&nbsp;A&#32;B&nbsp;</b>;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== t1 || $[8] !== t2 || $[9] !== t3) {
        t5 = <div>{t1}{t2}{t3}{t4}</div>;
        $[7] = t1;
        $[8] = t2;
        $[9] = t3;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    return t5;
}
