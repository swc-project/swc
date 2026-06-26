import { c as _c } from "react/compiler-runtime";
import defaultValue, { named as renamed, type RemoteType, "dash-name" as dashName } from "./dep";
import * as tools from "./tools";
import "./side-effect";
import "./empty";
import config from "./config.json" with {
    type: "json"
};
import source wasm from "./wasm";
import defer * as deferred from "./deferred";
class ExportedBase {
}
const localValue = renamed ?? defaultValue;
function LocalComponent() {
    const $ = _c(1);
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <span data-config={config.mode}>{dashName}</span>;
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
export { localValue, LocalComponent as Component, type RemoteType };
export { default as depDefault, named as depNamed } from "./dep";
export { dashName as "dash-name" };
export * from "./everything";
export * as everything from "./everything";
export default class DefaultModule extends ExportedBase {
    static tools = tools;
    static wasm = wasm;
    static deferred = deferred;
}
