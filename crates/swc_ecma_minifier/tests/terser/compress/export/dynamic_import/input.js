import traditional from "./traditional.js";
function imp(x) {
    return import(x);
}
import("module_for_side_effects.js");
let dynamic = import("some/module.js");
dynamic.foo();
