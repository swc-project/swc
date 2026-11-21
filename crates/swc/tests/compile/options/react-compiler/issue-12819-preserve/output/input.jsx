import { c as _c } from "react/compiler-runtime";
function withNbsp(label) {
    return <span>
      {label}
      &nbsp;
    </span>;
}
function withSpace(label) {
    return <span>
      {label}
      &#32;
    </span>;
}
export function Header(t0) {
    const $ = _c(7);
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
    if ($[4] !== t1 || $[5] !== t2) {
        t3 = <div>{t1}{t2}</div>;
        $[4] = t1;
        $[5] = t2;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    return t3;
}
