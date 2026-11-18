import {} from "./foo.ts";
import {} from "../foo.mts";
import {} from "../../foo.cts";
import {} from "./foo.tsx";
import foo = require("./foo.ts");
import "./foo.ts";
export * from "./foo.ts";
//Shim
import("./foo.ts");
import("./foo.ts", { with: { attr: "value" } });
import("" + "./foo.ts");
// @Filename: js.js
// Rewrite
import {} from "./foo.ts";
import {} from "../foo.mts";
import {} from "../../foo.cts";
import {} from "./foo.tsx";
import "./foo.ts";
export * from "./foo.ts";
// Shim
import("./foo.ts");
import("./foo.ts", { with: { attr: "value" } });
require("./foo.ts");
{
    require("./foo.ts");
    require(getPath());
}
