import o from "./traditional.js";
function t(o) {
    return import(o);
}
import("module_for_side_effects.js");
let r = import("some/module.js");
r.foo();
