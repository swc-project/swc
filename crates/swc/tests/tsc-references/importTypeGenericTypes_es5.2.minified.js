import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Bar = function(input) {
    "use strict";
    _class_call_check(this, Bar);
};
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
export var Bar2 = function(input) {
    "use strict";
    _class_call_check(this, Bar2);
};
export var shim = {
    Bar: Bar2
};
module.exports = Point;
export { Bar };
