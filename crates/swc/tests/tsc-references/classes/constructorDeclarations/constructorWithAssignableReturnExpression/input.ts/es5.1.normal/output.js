function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    return 1;
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
    return 1; // error
};
var E = function E() {
    "use strict";
    _classCallCheck(this, E);
    return {
        x: 1
    };
};
var F = function F() {
    "use strict";
    _classCallCheck(this, F);
    return {
        x: 1
    }; // error
};
var G = function G() {
    "use strict";
    _classCallCheck(this, G);
    return {
        x: null
    };
};
