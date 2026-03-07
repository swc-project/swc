import foo, {bar as baz}, {qux} from "pkg" with {type: "json", mode: "strict"};
export {baz as fooExport} from "pkg" with {type: "json"};
export * as ns from "pkg2" with {type: "json"};
