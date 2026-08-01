import { c as _c } from "react/compiler-runtime";
namespace Local {
    export namespace Nested {
        export const value = 1;
    }
    export interface Shape {
        name: string;
    }
}
namespace Dotted.Inner {
    export const value = 2;
}
import LocalAlias = Local.Nested;
import External = require("./external");
declare module "./external" {
    export interface ExternalShape {
        ready: boolean;
    }
}
declare global {
    var fixtureFlag: boolean;
}
enum Status {
    Ready = "ready",
    Waiting = 1,
    Done
}
const aliases = [
    LocalAlias.value,
    External,
    Status.Done
];
export as namespace FixtureAstRoundtrip;
export function App() {
    const $ = _c(1);
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <div data-kind="modules"/>;
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
export { };
