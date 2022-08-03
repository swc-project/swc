import o from "./traditional.js";
function r(o) {
    return import(o);
}
import("module_for_side_effects.js");
let t = import("some/module.js");
t.foo();
