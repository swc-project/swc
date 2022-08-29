//// [twoAccessorsWithSameName.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _define_enumerable_properties from "@swc/helpers/src/_define_enumerable_properties.mjs";
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
            } // error
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
            set: function set(v1) {} // error
        }
    ]);
    return D;
}();
var E = /*#__PURE__*/ function() {
    "use strict";
    function E() {
        _class_call_check(this, E);
    }
    _create_class(E, [
        {
            key: "x",
            get: function get() {
                return 1;
            },
            set: function set(v1) {}
        }
    ]);
    return E;
}();
var _obj, _mutatorMap = {};
var x = (_obj = {
    get x () {
        return 1;
    }
}, // error
_mutatorMap["x"] = _mutatorMap["x"] || {}, _mutatorMap["x"].get = function() {
    return 1;
}, _define_enumerable_properties(_obj, _mutatorMap), _obj);
var y = {
    get x () {
        return 1;
    },
    set x (v){}
};
