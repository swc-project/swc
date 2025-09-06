// No rewrite or shim
// @Filename: no.ts
import "./foo.ts/foo.js";
import "foo.ts";
import "pkg/foo.ts";
import ".foo.ts";
import "./foo.d.ts";
import "./foo.d.mts";
import "./foo.d.css.ts";
import "#internal/foo.ts";
import "node:foo.ts";
// (require)("./foo.ts");
import("node:path");
require("node:path");
