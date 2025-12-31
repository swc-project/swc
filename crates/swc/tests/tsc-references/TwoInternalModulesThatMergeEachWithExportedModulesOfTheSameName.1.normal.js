//// [TwoInternalModulesThatMergeEachWithExportedModulesOfTheSameName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
    var B;
})(A || (A = {}));
// ensure the right var decl is exported
var x;
var x = A.B.x;
(function(X) {
    (function(Y) {
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _class_call_check(this, Line);
            };
            Z.Line = Line;
        })(Y.Z || (Y.Z = {}));
    })(X.Y || (X.Y = {}));
})(X || (X = {}));
(function(X) {
    (function(Y) {
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _class_call_check(this, Line);
            };
            Z.Line = Line;
        })(Z || (Z = {}));
        var Z;
    })(Y || (Y = {}));
})(X || (X = {}));
// make sure merging works as expected
var l;
var l;
var A, X;
export var Y;
