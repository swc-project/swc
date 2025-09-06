import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
import "./foo.js";
import "../foo.mjs";
import "../../foo.cjs";
import "./foo.jsx";
const foo = __require("./foo.ts");
import "./foo.js";
export * from "./foo.js";
//Shim
import("./foo.js");
import("./foo.js", {
    with: {
        attr: "value"
    }
});
import("" + "./foo.ts");
// @Filename: js.js
// Rewrite
import "./foo.js";
import "../foo.mjs";
import "../../foo.cjs";
import "./foo.jsx";
import "./foo.js";
export * from "./foo.js";
// Shim
import("./foo.js");
import("./foo.js", {
    with: {
        attr: "value"
    }
});
require("./foo.ts");
{
    require("./foo.ts");
    require(getPath());
}
