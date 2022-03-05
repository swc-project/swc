import * as swcHelpers from "@swc/helpers";
//@target: ES6
swcHelpers._instanceof(Symbol(), Symbol);
swcHelpers._instanceof(Symbol, Symbol());
swcHelpers._instanceof(Symbol() || {}, Object); // This one should be okay, it's a valid way of distinguishing types
swcHelpers._instanceof(Symbol, Symbol() || {});
