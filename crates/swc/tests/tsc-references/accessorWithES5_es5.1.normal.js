import * as swcHelpers from "@swc/helpers";
var C = // @target: ES5
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "x",
            get: function get() {
                return 1;
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    swcHelpers.createClass(D, [
        {
            key: "x",
            set: function set(v) {}
        }
    ]);
    return D;
}();
var x = {
    get a () {
        return 1;
    }
};
var y = {
    set b (v){}
};
