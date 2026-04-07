"use client";

import { c as _c } from "react/compiler-runtime";
/* leading comment */ export function Greeting(t0) {
    const $ = _c(2);
    const { name } = t0;
    let t1;
    if ($[0] !== name) {
        (t1 = <div>{name}</div>);
        ($[0] = name);
        ($[1] = t1);
    } else {
        (t1 = $[1]);
    }
    return t1;
}
