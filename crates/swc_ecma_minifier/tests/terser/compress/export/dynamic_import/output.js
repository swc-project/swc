import t from "./traditional.js";
function r(o) {
    return import(o);
}
import("module_for_side_effects.js");
let o = import("some/module.js");
o.foo();
