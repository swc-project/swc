// import
export { a  as a1} from "./util/index.js";
export { a  as a2} from "./util/index.ts";
export { a  as a3} from "./util";
export { a  as a4} from "@/util/index.js";
export { a  as a5} from "@/util/index.ts"; // not work
export { a  as a6} from "@/util";


// import()
const b1 = await import("./util/index.js");
const b2 = await import("./util/index.ts");
const b3 = await import("./util");
const b4 = await import("@/util/index.js");
const b5 = await import("@/util/index.ts"); // not work
const b6 = await import("@/util");

// require
const c1 = require("./util/index.js");
const c2 = require("./util/index.ts");
const c3 = require("./util");
const c4 = require("@/util/index.js");
const c5 = require("@/util/index.ts");
const c6 = require("@/util");
