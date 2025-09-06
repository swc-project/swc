// No rewrite or shim
// @Filename: no.ts
import "./foo.ts/foo.js";
import "foo.js";
import "pkg/foo.js";
import ".foo.js";
import "./foo.d.ts";
import "./foo.d.mts";
import "./foo.d.css.ts";
import "#internal/foo.js";
import "node:foo.js";
require("./foo.ts");
import("node:path");
require("node:path");
