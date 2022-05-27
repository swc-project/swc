import b from "./traditional.js";
function c(a) {
    return import(a);
}
import("module_for_side_effects.js");
let a = import("some/module.js");
a.foo();
