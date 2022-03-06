import * as swcHelpers from "@swc/helpers";
swcHelpers._instanceof(Symbol(), Symbol), swcHelpers._instanceof(Symbol, Symbol()), swcHelpers._instanceof(Symbol() || {}, Object), swcHelpers._instanceof(Symbol, Symbol() || {});
