//// [ModuleWithExportedAndNonExportedClasses.ts]
var A, A1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A1 = A = {}).A = function A() {
    _class_call_check(this, A);
}, A1.AG = function AG() {
    _class_call_check(this, AG);
}, new A.A(), new A.AG(), new A.A2(), new A.A2();
