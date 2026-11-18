import defaultValue, { named as renamed, type RemoteType, "dash-name" as dashName } from "./dep";
import * as tools from "./tools";
import "./side-effect";
import {} from "./empty";
import config from "./config.json" with { type: "json" };
import source wasm from "./wasm";
import defer * as deferred from "./deferred";

class ExportedBase {}

const localValue = renamed ?? defaultValue;

function LocalComponent() {
    return <span data-config={config.mode}>{dashName}</span>;
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
