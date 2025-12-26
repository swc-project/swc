//// [ClassAndModuleThatMergeWithStaticVariableAndNonExportedVarThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new WeakMap();
var A, A1, Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
Point || (Point = {}), A = A1 || (A1 = {}), new WeakMap(), A.Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, A.Point || (A.Point = {});
