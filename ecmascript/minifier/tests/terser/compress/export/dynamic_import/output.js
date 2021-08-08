import a from "./traditional.js";
function b(c) {
    return import(c);
}
import("module_for_side_effects.js");
let d = import("some/module.js");
d.foo();
