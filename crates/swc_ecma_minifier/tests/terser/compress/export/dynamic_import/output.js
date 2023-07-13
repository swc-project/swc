import o from "./traditional.js";
function t(t) {
    return import(t);
}
import("module_for_side_effects.js");
let r = import("some/module.js");
r.foo();
