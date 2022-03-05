import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    return 1;
};
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    return 1; // error
};
var E = function E() {
    "use strict";
    swcHelpers.classCallCheck(this, E);
    return {
        x: 1
    };
};
var F = function F() {
    "use strict";
    swcHelpers.classCallCheck(this, F);
    return {
        x: 1
    }; // error
};
var G = function G() {
    "use strict";
    swcHelpers.classCallCheck(this, G);
    return {
        x: null
    };
};
