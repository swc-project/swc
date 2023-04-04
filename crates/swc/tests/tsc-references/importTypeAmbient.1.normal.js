//// [importTypeAmbient.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x = {
    x: 0,
    y: 0
};
var y = {
    a: "",
    b: 0
};
var Bar2 = function Bar2(input) {
    "use strict";
    _class_call_check(this, Bar2);
};
var shim = {
    Bar: Bar2
};
