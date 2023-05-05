//// [ExportObjectLiteralAndObjectTypeLiteralWithAccessibleTypesInMemberTypeAnnotations.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    var Origin = A.Origin = {
        x: 0,
        y: 0
    };
    var Unity = A.Unity = {
        start: new Point(0, 0),
        end: new Point(1, 0)
    };
})(A || (A = {}));
