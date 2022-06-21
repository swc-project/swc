import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
// @target: ES3
// error to use accessors in ES3 mode
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
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
        _class_call_check(this, D);
    }
    _create_class(D, [
        {
            key: "x",
            set: function set(v1) {}
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
