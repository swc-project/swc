//// [ExportObjectLiteralAndObjectTypeLiteralWithAccessibleTypesInNestedMemberTypeAnnotations.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    var UnitSquare = null;
    Object.defineProperty(A, "UnitSquare", {
        enumerable: true,
        get: function get() {
            return UnitSquare;
        },
        set: function set(v) {
            UnitSquare = v;
        }
    });
})(A || (A = {}));
