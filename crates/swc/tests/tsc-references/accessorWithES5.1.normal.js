//// [accessorWithES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
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
