//// [mappedTypesAndObjects.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f1(x, y) {
    var obj;
    obj = x;
    obj = y;
}
function f2(x, y) {
    var obj;
    obj = x;
    obj = y;
}
function f3(x) {
    x = {};
}
// Repro from #13747
var Form = function Form() {
    "use strict";
    _class_call_check(this, Form);
    this.values = {};
};
