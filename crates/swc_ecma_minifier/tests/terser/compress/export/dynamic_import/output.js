"module evaluation";
import "./traditional.js";
import("module_for_side_effects.js");
let o = import("some/module.js");
o.foo();
