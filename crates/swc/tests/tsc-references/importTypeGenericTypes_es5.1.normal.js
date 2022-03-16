import * as swcHelpers from "@swc/helpers";
module.exports = Point;
var Bar = function Bar(input) {
    "use strict";
    swcHelpers.classCallCheck(this, Bar);
};
export { Bar };
// @filename: usage.ts
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
    "use strict";
    swcHelpers.classCallCheck(this, Bar2);
};
export var shim = {
    Bar: Bar2
};
