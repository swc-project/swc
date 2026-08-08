import { c as _c } from "react/compiler-runtime";
type PanelMode = "on";
const typedPanel = <UI.Panel<PanelMode> x="on"/>;
export function App<T extends string = "on">(x: T): React.ReactElement {
    const $ = _c(6);
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {
            hidden: false,
            role: "status"
        };
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    const panelProps = t0;
    let t1;
    let t2;
    let t3;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = <strong>{dashboard.user.name}</strong>;
        t2 = <svg:path xml:space="preserve" d={icons.ready}/>;
        t3 = <>{dashboard.count > 0 ? <span/> : null}</>;
        $[1] = t1;
        $[2] = t2;
        $[3] = t3;
    } else {
        t1 = $[1];
        t2 = $[2];
        t3 = $[3];
    }
    let t4;
    if ($[4] !== x) {
        t4 = <section data-id={dashboard.id} {...panelProps}><UI.Panel<T> x={x} title={`Status: ${Status.Ready}`}>{t1}{t2}{t3}{dashboard.actions}</UI.Panel></section>;
        $[4] = x;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    return t4;
}
