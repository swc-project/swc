import a from "./traditional.js";
function b(a) {
    return import(a);
}
import("module_for_side_effects.js");
let c = import("some/module.js");
c.foo();
