//// [directDependenceBetweenTypeAliases.ts]
// It is an error for the type specified in a type alias to depend on that type alias
// A type alias directly depends on the type it aliases.
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
// A type query directly depends on the type of the referenced entity.
var x = [];
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
var yy;
var zz;
