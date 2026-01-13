import { _ as _ts_rewrite_relative_import_extension } from "@swc/helpers/_/_ts_rewrite_relative_import_extension";
import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const foo = __require("./foo.ts");
export * from "./foo.js";
//Shim
import("./foo.js");
import("./foo.js", {
    with: {
        attr: "value"
    }
});
import(_ts_rewrite_relative_import_extension("" + "./foo.ts"));
export * from "./foo.js";
// Shim
import("./foo.js");
import("./foo.js", {
    with: {
        attr: "value"
    }
});
require("./foo.js");
{
    require("./foo.js");
    require(_ts_rewrite_relative_import_extension(getPath()));
}
