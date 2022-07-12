// @module: amd
// @target: ES5
// @filename: t1.ts
import b from "./t1";
import * as c from "./t1";
import { default as d } from "./t1";
import e1, * as e2 from "./t1";
import f1, { default as f2 } from "./t1";
import "./t1";
import b from "./t1";
import * as c from "./t1";
import { default as d } from "./t1";
import e1, * as e2 from "./t1";
import f1, { default as f2 } from "./t1";
export default "hello";
// @filename: t2.ts
const a = require("./t1");
a.default;
b;
c.default;
d;
e1;
e2.default;
f1;
f2;
// @filename: t3.ts
const a = require("./t1");
a.default;
b;
c.default;
d;
e1;
e2.default;
f1;
f2;
export { a, b, c, d, e1, e2, f1, f2 };
