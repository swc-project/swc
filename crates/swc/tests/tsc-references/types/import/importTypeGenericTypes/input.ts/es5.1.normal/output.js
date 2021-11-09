function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
module.exports = Point;
var Bar = function Bar(input) {
    "use strict";
    _classCallCheck(this, Bar);
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
    _classCallCheck(this, Bar2);
};
export var shim = {
    Bar: Bar2
};
