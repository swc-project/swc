//// [foo.ts]
export { };
//// [foo2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Bar || (Bar = {}), Baz || (Baz = {});
var Bar = function Bar(input) {
    _class_call_check(this, Bar);
};
export var Baz;
export { Bar };
//// [usage.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var x = {
    x: 0,
    y: 0,
    data: {
        x: 12
    }
};
export var y = {
    a: "",
    b: 0,
    data: {
        x: 12
    }
};
export var Bar2 = function Bar2(input) {
    _class_call_check(this, Bar2);
};
export var shim = {
    Bar: Bar2
};
