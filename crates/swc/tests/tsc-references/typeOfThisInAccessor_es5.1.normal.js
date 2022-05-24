import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: "x",
            get: function get() {
                var r = this; // C
                return 1;
            }
        }
    ], [
        {
            key: "y",
            get: function get() {
                var r2 = this; // typeof C
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
            get: function get() {
                var r = this; // D<T>
                return 1;
            }
        }
    ], [
        {
            key: "y",
            get: function get() {
                var r2 = this; // typeof D
                return 1;
            }
        }
    ]);
    return D;
}();
var x = {
    get a () {
        var r3 = this; // any
        return 1;
    }
};
